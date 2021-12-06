// SPDX-License-Identifier: CC0
pragma solidity ^0.6.11;

/**
@title IVerifier
@dev Example Verifier Implementation
*/
interface IVerifier {
    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[5] memory input
    ) public view returns (bool r);
}