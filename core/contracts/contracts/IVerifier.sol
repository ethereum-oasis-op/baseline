// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;

/**
@title IVerifier
@dev Example Verifier Implementation
@notice Do not use this example in any production code!
*/
interface IVerifier {

    function verify(
        uint256[] calldata _proof,
        uint256[] calldata _inputs,
        uint256[] calldata _vk
    ) external returns (bool result);
}
