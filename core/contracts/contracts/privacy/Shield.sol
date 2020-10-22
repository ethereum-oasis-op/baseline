// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;

import "./lib/MerkleTree_sha256.sol";
import "./IShield.sol";
import "./IVerifier.sol";

contract Shield is IShield, MerkleTree_sha256 {
    // Observers may wish to listen for nullification of commitments:
    event NewCommitment(bytes32 newCommitment);
    event UpdatedCommitment(bytes32 nullifier, bytes32 newCommitment);
    event DeletedCommitment(bytes32 nullifier);

    // CONTRACT INSTANCES:
    IVerifier private verifier; // the verification smart contract

    // PRIVATE TRANSACTIONS' PUBLIC STATES:
    mapping(bytes32 => bytes32) public commitments; // store commitments
    mapping(bytes32 => bytes32) public nullifiers; // store nullifiers of spent commitments
    mapping(bytes32 => bytes32) public roots; // holds each root we've calculated so that we can pull the one relevant to the prover
    bytes32 public latestRoot; // holds the index for the latest root so that the prover can provide it later

    // FUNCTIONS:
    constructor(address _verifier, uint _treeHeight) public MerkleTree_sha256(_treeHeight) {
        verifier = IVerifier(_verifier);
    }

    // returns the verifier-interface contract address that this shield contract is calling
    function getVerifier() external override view returns (address) {
        return address(verifier);
    }

    function verifyAndPush(
        uint256[] calldata _proof,
        uint256[] calldata _inputs,
        bytes32 _newCommitment
    ) external override returns (bool) {

        // Check that the publicInputHash equals the hash of the 'public inputs':
        bytes31 publicInputHash = bytes31(bytes32(_inputs[0]) << 8);
        bytes31 publicInputHashCheck = bytes31(sha256(abi.encodePacked(_newCommitment)) << 8);
        require(publicInputHashCheck == publicInputHash, "publicInputHash cannot be reconciled");

        // verify the proof
        bool result = verifier.verify(_proof, _inputs);
        require(result, "The proof failed verification in the verifier contract");

        // update contract states
        commitments[_newCommitment] = _newCommitment;
        latestRoot = insertLeaf(_newCommitment); // recalculate the root of the merkleTree as it's now different
        roots[latestRoot] = latestRoot; // and save the new root to the list of roots

        emit NewCommitment(_newCommitment);

        return true;
    }

}
