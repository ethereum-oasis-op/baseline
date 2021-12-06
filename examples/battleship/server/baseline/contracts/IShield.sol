// SPDX-License-Identifier: CC0
pragma solidity ^0.6.11;

interface IShield {

    function getVerifier() external view returns (address);
    function verifyAndPush(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[5] memory input,
        bytes32 _newCommitment
    ) external returns (bool);
}