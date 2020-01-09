pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;
import "./ERC165Compatible.sol";
import "./Registrar.sol";
import "./IOrgRegistry.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";

/// @dev Contract for maintaining organization registry
/// Contract inherits from Ownable and ERC165Compatible
/// Ownable contains ownership criteria of the organization registry
/// ERC165Compatible contains interface compatibility checks
contract OrgRegistry is Ownable, ERC165Compatible, Registrar, IOrgRegistry {
    /// @notice Leverages roles contract as imported above to assign different roles
    using Roles for Roles.Role;

    enum Role {Null, Buyer, Supplier, Carrier}

    struct Org {
        address orgAddress;
        bytes32 name;
        uint role;
        bytes messagingKey;
    }

    struct OrgInterfaces {
        bytes32 groupName;
        address tokenFactoryAddress;
        address shieldAddress;
        address verifierRegistryAddress;
    }

    mapping (address => Org) orgMap;
    mapping (uint => OrgInterfaces) orgInterfaceMap;
    uint orgInterfaceCount;
    mapping (uint => Roles.Role) private roleMap;
    address[] public parties;
    mapping(address => address) managerMap;

    event RegisterOrg(
        bytes32 _name,
        address _address,
        uint _role,
        bytes _key
    );

    /// @dev constructor function that takes the address of a pre-deployed ERC1820
    /// registry. Ideally, this contract is a publicly known address:
    /// 0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24. Inherently, the constructor
    /// sets the interfaces and registers the current contract with the global registry
    constructor(address _erc1820) public Ownable() ERC165Compatible() Registrar(_erc1820) {
        setInterfaces();
        setInterfaceImplementation("IOrgRegistry", address(this));
    }

    /// @notice This is an implementation of setting interfaces for the organization
    /// registry contract
    /// @dev the character '^' corresponds to bit wise xor of individual interface id's
    /// which are the parsed 4 bytes of the function signature of each of the functions
    /// in the org registry contract
    function setInterfaces() public onlyOwner returns (bool) {
        /// 0x3ece76e8 is equivalent to the bytes4 of the function selectors in IOrgRegistry
        supportedInterfaces[0x3ece76e8] = true;
        return true;
    }

    /// @notice This function is a helper function to be able to get the
    /// set interface id by the setInterfaces()
    function getInterfaces() external pure returns (bytes4) {
        return 0x3ece76e8;
    }

    /// @dev Since this is an inherited method from ERC165 Compatible, it returns the value of the interface id
    /// set during the deployment of this contract
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return supportedInterfaces[interfaceId];
    }

    /// @notice Indicates whether the contract implements the interface 'interfaceHash' for the address 'addr' or not.
    /// @dev Below implementation is necessary to be able to have the ability to register with ERC1820
    /// @param interfaceHash keccak256 hash of the name of the interface
    /// @param addr Address for which the contract will implement the interface
    /// @return ERC1820_ACCEPT_MAGIC only if the contract implements 'interfaceHash' for the address 'addr'.
    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) external view returns(bytes32) {
        return ERC1820_ACCEPT_MAGIC;
    }

    /// @dev Since this is an inherited method from Registrar, it allows for a new manager to be set
    /// for this contract instance
    function assignManager(address _oldManager, address _newManager) external {
        assignManagement(_oldManager, _newManager);
    }

    /// @notice Function to register an organization
    /// @param _address ethereum address of the registered organization
    /// @param _name name of the registered organization
    /// @param _role role of the registered organization
    /// @param _key public keys required for message communication
    /// @dev Function to register an organization
    /// @return `true` upon successful registration of the organization
    function registerOrg(address _address, bytes32 _name, uint _role, bytes calldata _key) external returns (bool) {
        Org memory org = Org(_address, _name, _role, _key);
        roleMap[_role].add(_address);
        orgMap[_address] = org;
        parties.push(_address);
        emit RegisterOrg(
            _name,
            _address,
            _role,
            _key
        );
        return true;
    }

    /// @notice Function to register the names of the interfaces associated with the OrgRegistry
    /// @param _groupName name of the working group registered by an organization
    /// @param _tokenFactoryAddress name of the registered token interface
    /// @param _shieldAddress name of the registered shield registry interface
    /// @param _verifierRegistryAddress name of the verifier registry interface
    /// @dev Function to register an organization's interfaces for easy lookup
    /// @return `true` upon successful registration of the organization's interfaces
    function registerInterfaces(bytes32 _groupName, address _tokenFactoryAddress, address _shieldAddress, address _verifierRegistryAddress) external returns (bool) {
        orgInterfaceMap[orgInterfaceCount] = OrgInterfaces(_groupName, _tokenFactoryAddress, _shieldAddress, _verifierRegistryAddress);
        orgInterfaceCount++;
        return true;
    }

    /// @dev Function to get the count of number of organizations to help with extraction
    /// @return length of the array containing organization addresses
    function getOrgCount() external view returns (uint) {
        return parties.length;
    }

    /// @notice Function to get a single organization's details
    function getOrg(address _address) external view returns (address, bytes32, uint, bytes memory) {
        return (orgMap[_address].orgAddress, orgMap[_address].name, orgMap[_address].role, orgMap[_address].messagingKey);
    }

    /// @notice Function to get a single organization's interface details
    function getInterfaceAddresses() external view returns (bytes32[] memory, address[] memory, address[] memory, address[] memory) {
        bytes32[] memory gName = new bytes32[](orgInterfaceCount);
        address[] memory tfAddress = new address[](orgInterfaceCount);
        address[] memory sAddress = new address[](orgInterfaceCount);
        address[] memory vrAddress = new address[](orgInterfaceCount);

        for(uint i = 0; i < orgInterfaceCount; i++) {
            OrgInterfaces storage orgInterfaces = orgInterfaceMap[i];
            gName[i] = orgInterfaces.groupName;
            tfAddress[i] = orgInterfaces.tokenFactoryAddress;
            sAddress[i] = orgInterfaces.shieldAddress;
            vrAddress[i] = orgInterfaces.verifierRegistryAddress;
        }
        return (gName, tfAddress, sAddress, vrAddress);
    }
    
    /// @notice Function to retrieve a page of registered organizations along with details
    /// @notice start and end indices here are a convenience for pagination
    /// @param start starting index of the array where organization addresses are stored
    /// @param count ending index of the array where organization addresses are stored
    /// @dev Getter to retrieve details of the organization enabled for pagination
    /// @return array form of the details of the organization as stored in the struct
    function getOrgs(uint start, uint count) external view returns (address[] memory, bytes32[] memory , uint[] memory, bytes[] memory) {
        uint end = start + count - 1;
        if (end >= parties.length) end = parties.length - 1;

        uint size = end - start + 1;
        address[] memory addresses = new address[](size);
        bytes32[] memory names = new bytes32[](size);
        uint[] memory roles = new uint[](size);
        bytes[] memory keys = new bytes[](size);

        for (uint i = 0; i < size; i++) {
            addresses[i] = parties[i + start];
            names[i] = orgMap[parties[i + start]].name;
            roles[i] = orgMap[parties[i + start]].role;
            keys[i] = orgMap[parties[i + start]].messagingKey;
        }

        return (addresses, names, roles, keys); 
    }
}
