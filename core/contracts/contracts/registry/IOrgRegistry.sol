// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;
pragma experimental ABIEncoderV2;

interface IOrgRegistry {
    function registerOrg(
        address,
        bytes32,
        bytes calldata,
        bytes calldata,
        bytes calldata,
        bytes calldata
    ) external returns (bool);

    function updateOrg(
        address,
        bytes32,
        bytes calldata,
        bytes calldata,
        bytes calldata,
        bytes calldata
    ) external returns (bool);

    function getOrgCount() external view returns (uint);

    function getOrg(address) external view returns (
        address,
        bytes32,
        bytes memory,
        bytes memory,
        bytes memory,
        bytes memory
    );
}
