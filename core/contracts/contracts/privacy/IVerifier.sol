// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;

/**
@title IVerifier
@dev Example Verifier Implementation
*/
interface IVerifier {

    function verify(
        uint256[] calldata proof,
        uint256[] calldata publicInputs
    ) external returns (bool result);
}
