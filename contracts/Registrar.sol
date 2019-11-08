pragma solidity ^0.5.8;

import "./ERC1820Registry.sol";

contract Registrar is ERC1820Registry {

    ERC1820Registry ERC1820REGISTRY;

    constructor (address ERC1820RegistryAddress) public {
        // ERC1820Registry constant ERC1820REGISTRY = ERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        ERC1820REGISTRY = ERC1820Registry(ERC1820RegistryAddress);
    }

    function setInterfaceImplementation(string memory _interfaceLabel, address _implementation) internal {
        bytes32 interfaceHash = keccak256(abi.encodePacked(_interfaceLabel));
        ERC1820REGISTRY.setInterfaceImplementer(address(this), interfaceHash, _implementation);
    }

    function interfaceAddr(address addr, string memory _interfaceLabel) internal view returns(address) {
        bytes32 interfaceHash = keccak256(abi.encodePacked(_interfaceLabel));
        return ERC1820REGISTRY.getInterfaceImplementer(addr, interfaceHash);
    }
}