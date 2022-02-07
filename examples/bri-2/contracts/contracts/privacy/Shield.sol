// SPDX-License-Identifier: CC0
pragma solidity ^0.8.5;

import "./lib/MerkleTreeSHA256.sol";
import "./IShield.sol";
import "./IVerifier.sol";

contract Shield is IShield, MerkleTreeSHA256 {
    // CONTRACT INSTANCES:
    IVerifier private verifier; // the verification smart contract

    // FUNCTIONS:
    constructor(address _verifier, uint _treeHeight) MerkleTreeSHA256(_treeHeight) {
        verifier = IVerifier(_verifier);
    }

    // returns the verifier contract address that this shield contract uses for proof verification
    function getVerifier() external view override returns (address) {
        return address(verifier);
    }

    function verifyAndPush(
        uint256[2] memory _proofA,
        uint256[2][2] memory _proofB,
        uint256[2] memory _proofC,
        uint256[1] memory _publicInputs,
        bytes32 _newCommitment
    ) external override returns (bool) {

        // verify the proof
        bool result = verifier.verifyProof(_proofA, _proofB, _proofC, _publicInputs);
        require(result, "The proof failed verification in the verifier contract");

        // update contract states
        insertLeaf(_newCommitment); // recalculate the root of the merkleTree as it's now different
        return true;
    }

}
