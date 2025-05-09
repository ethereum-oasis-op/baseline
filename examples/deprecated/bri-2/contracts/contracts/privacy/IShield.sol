// SPDX-License-Identifier: CC0
pragma solidity ^0.8.5;

interface IShield {

    function getVerifier() external view returns (address);
    function verifyAndPush(
        uint256[2] memory _proofA,
        uint256[2][2] memory _proofB,
        uint256[2] memory _proofC,
        uint256[1] memory _publicInputs,
        bytes32 _newCommitment
    ) external returns (bool);

}
