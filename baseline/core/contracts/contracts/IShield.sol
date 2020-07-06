pragma solidity ^0.6.9;

interface IShield {

    function close() external returns (bool);
    function changeVerifier(address _verifier) external returns (bool);
    function getVerifier() external view returns (address);

    function createAgreement(
        uint256[] calldata,
        uint256[] calldata,
        bytes32
    ) external returns (bool);
}
