// SPDX-License-Identifier: CC0
pragma solidity ^0.8.5;

/**
@title IVerifier
@dev Example Verifier Implementation
*/
interface IVerifier {

    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external returns (bool);

}
