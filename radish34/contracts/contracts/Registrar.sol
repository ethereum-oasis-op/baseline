pragma solidity ^0.5.8;

import "./ERC1820Registry.sol";

/// @dev Contract that acts as a client for interacting with the ERC1820Registry
contract Registrar {

    ERC1820Registry ERC1820REGISTRY;

    bytes32 constant internal ERC1820_ACCEPT_MAGIC = keccak256(abi.encodePacked("ERC1820_ACCEPT_MAGIC"));

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyManager() {
        require(msg.sender == getManager(), "You are not authorised to invoke this function");
        _;
    }

    
    /// @notice Constructor that takes an argument of the ERC1820RegistryAddress
    /// @dev Upon actual deployment of a static registry contract, this argument can be removed
    /// @param ERC1820RegistryAddress pre-deployed ERC1820 registry address
    constructor (address ERC1820RegistryAddress) public {
        // Below line is to be uncommented during actual deployment since mainnet has a version of this address
        // ERC1820Registry constant ERC1820REGISTRY = ERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        ERC1820REGISTRY = ERC1820Registry(ERC1820RegistryAddress);
    }

    /// @dev This enables setting the interface implementation
    /// @notice Since this is an internal method any contract inheriting this contract would be
    /// leveraged as the sender for the interface registry
    /// @param _interfaceLabel label for the interface or the contract that is to be registered
    /// @param _implementation the implementing contract's address
    function setInterfaceImplementation(string memory _interfaceLabel, address _implementation) internal {
        bytes32 interfaceHash = keccak256(abi.encodePacked(_interfaceLabel));
        ERC1820REGISTRY.setInterfaceImplementer(address(this), interfaceHash, _implementation);
    }

    /// @dev This enables getting the address of the implementer
    /// @param addr the address for which the implementer is deployed
    /// @param _interfaceLabel label for the interface or the contract that is registered
    function interfaceAddr(address addr, string calldata _interfaceLabel) external view returns(address) {
        bytes32 interfaceHash = keccak256(abi.encodePacked(_interfaceLabel));
        return ERC1820REGISTRY.getInterfaceImplementer(addr, interfaceHash);
    }

    /// @dev This enables assigning or changing manager
    /// @notice Since this is an internal method any contract inheriting this contract would be
    /// leveraged to call this function directly
    /// @param _newManager address of the new manager who could set new interface implementations
    function assignManagement(address _newManager) internal {
        ERC1820REGISTRY.setManager(address(this), _newManager);
    }

    /// @dev This allows you to get this contract manager address
    function getManager() public view returns(address) {
        return ERC1820REGISTRY.getManager(address(this));
    }
}
