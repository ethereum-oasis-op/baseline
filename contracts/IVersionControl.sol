pragma solidity ^0.5.8;

interface IVersionControl {
    function versionRegistry (address registryAddress) external returns (bool);
    function setVersion(bytes32 registrationIdentifier, address issuee, bytes32 value) external returns (bool);
    function getVersion(bytes32 registrationIdentifier, address issuer, address issuee) external view returns (bytes32);
}