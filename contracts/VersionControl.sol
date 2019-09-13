pragma solidity ^0.5.8;

import "./IVersionControl.sol";

contract VersionControl is IVersionControl {
    uint public version;
    address public previousVersion;
    mapping(bytes32 => mapping(address => mapping(address => bytes32))) public registryMap;

    constructor (uint initialVersion) public {
        version = initialVersion;
    }

    function versionRegistry(address _previousPublishedVersion) external returns (bool) {
        version = 3;
        previousPublishedVersion = _previousPublishedVersion;
    }

    event Set(
    bytes32 indexed registrationIdentifier,
    address indexed issuer,
    address indexed issuee,
    uint updatedAt);

    //create or update
    function setVersion(bytes32 registrationIdentifier, address issuee, bytes32 value) external returns (bool) {
        emit Set(registrationIdentifier, msg.sender, issuee, now);
        registryMap[registrationIdentifier][msg.sender][issuee] = value;
    }

    function getVersion(bytes32 registrationIdentifier, address issuer, address issuee) external view returns (bytes32){
        return registryMap[registrationIdentifier][issuer][issuee];
    }
}