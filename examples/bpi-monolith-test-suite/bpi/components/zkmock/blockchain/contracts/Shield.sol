// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../../zkcircuits/ordercircuit/order.sol";

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
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[3] memory input,
        bytes32 _newCommitment
    ) external returns (bool r) {
        // verify the proof
        bool result = verifier.verifyProof(a, b, c, input);
        require(
            result,
            "The proof failed verification in the verifier contract"
        );

        // update contract states
        merkleRoot = _newCommitment;
        return true;
    }
}
