// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Verifier.sol";

contract Shield {
    //add verifier
    Verifier private verifier;
    bytes32 private merkleRoot;

    constructor(address _verifier) {
        verifier = Verifier(_verifier);
    }

    function getVerifier() external view returns (address) {
        return address(verifier);
    }

    //verify proof and add leaf to Merkle tree
    //if(verify(proof, publicInput) == true)
    //insert new leaf into merkle tree

    function verifyAndPush(
        uint256[] memory _proof,
        uint256[] memory _publicInput,
        bytes32 _newCommitment
    ) external returns (bool) {
        // verify the proof
        bool result = verifier.verifyProof(_proof, _publicInput);
        require(
            result,
            "The proof failed verification in the verifier contract"
        );

        // update contract states
        merkleRoot = _newCommitment;
        return true;
    }
}
