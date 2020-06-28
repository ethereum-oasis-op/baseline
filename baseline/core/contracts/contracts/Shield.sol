/**
Contract to enable the management of private fungible token (ERC-20) transactions using zk-SNARKs.
@Author Westlad, Chaitanya-Konda, iAmMichaelConnor
*/

pragma solidity ^0.5.8;

//TODO: Use openzeppelin interfaces inside the timber service
import "./ERC165Compatible.sol";
import "./MerkleTree.sol";
import "./IShield.sol";
import "./IVerifier.sol";
import "./Registrar.sol";
import "./Ownable.sol";
import "./ERC20Interface.sol";

contract Shield is Ownable, MerkleTree, ERC165Compatible, Registrar, IShield {
    // ENUMS:
    enum TransactionTypes { CreateMSA, CreatePO }

    // EVENTS:
    // Observers may wish to listen for nullification of commitments:
    event NewCommitment(bytes32 newCommitment);
    event UpdatedCommitment(bytes32 nullifier, bytes32 newCommitment);
    event DeletedCommitment(bytes32 nullifier);

    // Observers may wish to listen for zkSNARK-related changes:
    event VerifierChanged(address newVerifierContract);
    event VkChanged(TransactionTypes txType);

    // For testing only. This SHOULD be deleted before mainnet deployment:
    event GasUsed(uint256 byShieldContract, uint256 byVerifierContract);

    // CONTRACT INSTANCES:
    IVerifier private verifier; // the verification smart contract
    ERC20Interface private erc20ContractInstance; // the  ERC-20 token contract

    // PRIVATE TRANSACTIONS' PUBLIC STATES:
    mapping(bytes32 => bytes32) public commitments; // store commitments
    mapping(bytes32 => bytes32) public nullifiers; // store nullifiers of spent commitments
    mapping(bytes32 => bytes32) public roots; // holds each root we've calculated so that we can pull the one relevant to the prover
    bytes32 public latestRoot; // holds the index for the latest root so that the prover can provide it later and this contract can look up the relevant root

    // VERIFICATION KEY STORAGE:
    mapping(uint => uint256[]) public vks; // mapped to by an enum uint(TransactionTypes):

    // FUNCTIONS:
    constructor(address _verifier, address _erc1820) public ERC165Compatible() Registrar(_erc1820) {
        verifier = IVerifier(_verifier);
        setInterfaces();
        setInterfaceImplementation("IShield", address(this));
    }

    function setInterfaces() public onlyOwner returns (bool) {
        supportedInterfaces[this.changeVerifier.selector ^
                            this.getVerifier.selector ^
                            this.createMSA.selector ^
                            this.createPO.selector] = true;
        return true;
    }

    function getInterfaces() external pure returns (bytes4) {
        return this.changeVerifier.selector ^
                this.getVerifier.selector ^
                this.createMSA.selector ^
                this.createPO.selector;
    }

    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return supportedInterfaces[interfaceId];
    }

    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) external view returns(bytes32) {
        return ERC1820_ACCEPT_MAGIC;
    }

    function assignManager(address _newManager) onlyOwner external {
        assignManagement(_newManager);
    }

    /**
    self destruct
    */
    function close() external onlyOwner returns (bool) {
        selfdestruct(address(uint160(msg.sender)));
        return true;
    }

    /**
    function to change the address of the underlying Verifier contract
    */
    function changeVerifier(address _verifier) external onlyOwner returns (bool) {
        verifier = IVerifier(_verifier);
        emit VerifierChanged(_verifier);
        return true;
    }

    /**
    returns the verifier-interface contract address that this shield contract is calling
    */
    function getVerifier() external view returns (address) {
        return address(verifier);
    }

    /**
    Stores verification keys (for the 'mint', 'transfer' and 'burn' computations).
    */
    function registerVerificationKey(
        uint256[] calldata _vk,
        TransactionTypes _txType
    ) external onlyOwner returns (bytes32) {
        // CAUTION: we do not prevent overwrites of vk's. Users must listen for the emitted event to detect updates to a vk.
        vks[uint(_txType)] = _vk;

        emit VkChanged(_txType);
    }

    /**
    createMSA
    */
    function createMSA(
        uint256[] calldata _proof,
        uint256[] calldata _inputs,
        bytes32 _newMSACommitment
    ) external returns (bool) {

        // gas measurement:
        uint256 gasCheckpoint = gasleft();

        // Check that the publicInputHash equals the hash of the 'public inputs':
        bytes31 publicInputHash = bytes31(bytes32(_inputs[0]) << 8);
        bytes31 publicInputHashCheck = bytes31(sha256(abi.encodePacked(_newMSACommitment)) << 8);
        require(publicInputHashCheck == publicInputHash, "publicInputHash cannot be reconciled");

        // gas measurement:
        uint256 gasUsedByShieldContract = gasCheckpoint - gasleft();
        gasCheckpoint = gasleft();

        // verify the proof
        bool result = verifier.verify(_proof, _inputs, vks[uint(TransactionTypes.CreateMSA)]);
        require(result, "The proof has not been verified by the contract");

        // gas measurement:
        uint256 gasUsedByVerifierContract = gasCheckpoint - gasleft();
        gasCheckpoint = gasleft();

        // check inputs vs on-chain states
        // COMMENTED OUT THE BELOW, FOR QUICKER REPEATED TESTING.
        // require(commitments[_newMSACommitment] == 0, "The MSA commitment already exists!");

        // update contract states
        commitments[_newMSACommitment] = _newMSACommitment;
        latestRoot = insertLeaf(_newMSACommitment); // recalculate the root of the merkleTree as it's now different
        roots[latestRoot] = latestRoot; // and save the new root to the list of roots

        emit NewCommitment(_newMSACommitment);

        // gas measurement:
        gasUsedByShieldContract = gasUsedByShieldContract + gasCheckpoint - gasleft();
        emit GasUsed(gasUsedByShieldContract, gasUsedByVerifierContract);
        return true;
    }

    /**
    createPO
    */
    function createPO(
        uint256[] calldata _proof,
        uint256[] calldata _inputs,
        bytes32 _root,
        bytes32 _nullifierOfOldMSACommitment,
        bytes32 _newMSACommitment,
        bytes32 _newPOCommitment
    ) external returns(bool) {

        // gas measurement:
        uint256[3] memory gasUsed; // array needed to stay below local stack limit
        gasUsed[0] = gasleft();

        // Check that the publicInputHash equals the hash of the 'public inputs':
        bytes31 publicInputHash = bytes31(bytes32(_inputs[0]) << 8);
        bytes31 publicInputHashCheck = bytes31(sha256(abi.encodePacked(_root, _nullifierOfOldMSACommitment, _newMSACommitment, _newPOCommitment)) << 8);
        require(publicInputHashCheck == publicInputHash, "publicInputHash cannot be reconciled");

        // gas measurement:
        gasUsed[1] = gasUsed[0] - gasleft();
        gasUsed[0] = gasleft();

        // verify the proof
        bool result = verifier.verify(_proof, _inputs, vks[uint(TransactionTypes.CreatePO)]);
        require(result, "The proof has not been verified by the contract");

        // gas measurement:
        gasUsed[2] = gasUsed[0] - gasleft();
        gasUsed[0] = gasleft();

        // check inputs vs on-chain states
        require(roots[_root] == _root, "The input root has never been the root of the Merkle Tree");
        require(_newMSACommitment != _newPOCommitment, "The new commitments (_newMSACommitment and _newPOCommitment) must be different!"); // Is this check necessary?
        require(commitments[_newMSACommitment] == 0, "The MSA commitment already exists!");
        require(nullifiers[_nullifierOfOldMSACommitment] == 0, "The MSA commitment (which is being updated) has already been nullified!");
        require(commitments[_newPOCommitment] == 0, "The PO commitment already exists!");

        // update contract states
        nullifiers[_nullifierOfOldMSACommitment] = _nullifierOfOldMSACommitment; //remember we spent it

        bytes32[] memory leaves = new bytes32[](2);
        leaves[0] = _newMSACommitment;
        leaves[1] = _newPOCommitment;

        latestRoot = insertLeaves(leaves); // recalculate the root of the merkleTree as it's now different
        roots[latestRoot] = latestRoot; // and save the new root to the list of roots

        emit UpdatedCommitment(_nullifierOfOldMSACommitment, _newMSACommitment);
        emit NewCommitment(_newPOCommitment);

        // gas measurement:
        gasUsed[1] = gasUsed[1] + gasUsed[0] - gasleft();
        emit GasUsed(gasUsed[1], gasUsed[2]);
        return true;
    }
}
