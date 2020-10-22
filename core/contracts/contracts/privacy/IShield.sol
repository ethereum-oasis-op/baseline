// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;

interface IShield {

    function getVerifier() external view returns (address);
    function verifyAndPush(
        uint256[] calldata,
        uint256[] calldata,
        bytes32
    ) external returns (bool);

}
