pragma solidity ^0.5.8;
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
