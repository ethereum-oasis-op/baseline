pragma solidity ^0.5.8;

interface IShield {
    function close() external returns (bool);
    function changeVerifier(address _verifier) external returns (bool);
    function getVerifier() external view returns (address);
    function createMSA(
        uint256[] calldata,
        uint256[] calldata,
        bytes32
    ) external returns (bool);
    function createPO(
        uint256[] calldata,
        uint256[] calldata,
        bytes32,
        bytes32,
        bytes32,
        bytes32
    ) external returns(bool);
    function createAgreement(
        uint256[] calldata,
        uint256[] calldata,
        bytes32
    ) external returns (bool);

}
