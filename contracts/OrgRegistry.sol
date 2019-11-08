pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;
import "./ERC165Compatible.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";

/// @dev Contract for maintaining organization registry
/// Contract inherits from Ownable and ERC165Compatible
/// Ownable contains ownership criteria of the organization registry
/// ERC165Compatible contains interface compatibility checks
contract OrgRegistry is Ownable, ERC165Compatible {
    /// @notice Leverages roles contract as imported above to assign different roles
    using Roles for Roles.Role;

    enum Role {Null, Buyer, Supplier, Carrier}

    struct Org {
        address orgAddress;
        bytes32 name;
        uint role;
        bytes messagingKey;
    }

    mapping (address => Org) orgMap;
    mapping (uint => Roles.Role) private roleMap;
    address[] public parties;

    /// @dev constructor function
    constructor() public Ownable() ERC165Compatible() {
        setInterfaces();
    }

    /// @notice This is an implementation of setting interfaces for the organization
    /// registry contract
    /// @dev the character '^' corresponds to bit wise xor of individual interface id's
    /// which are the parsed 4 bytes of the function signature of each of the functions
    /// in the org registry contract
    function setInterfaces() public onlyOwner returns (bool) {
        supportedInterfaces[this.registerOrg.selector ^
                            this.getOrgCount.selector ^
                            this.getOrgs.selector] = true;
    }

    /// @notice This function is a helper function to be able to get the
    /// set interface id by the setInterfaces()
    function getInterfaces() external pure returns (bytes4) {
        return this.registerOrg.selector ^
                            this.getOrgCount.selector ^
                            this.getOrgs.selector;
    }

    /// @dev Since this is an inherited method from ERC165 Compatible, it returns the value of the interface id
    /// set during the deployment of this contract
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return supportedInterfaces[interfaceId];
    }

    /// @notice Function to register an organization
    /// @param _address ethereum address of the registered organization
    /// @param _name name of the registered organization
    /// @param _role role of the registered organization
    /// @param _key public keys required for message communication
    /// @dev Function to register an organization
    /// @return `true` upon successful registration of the organization
    function registerOrg(address _address, bytes32 _name, uint _role, bytes calldata _key) external onlyOwner returns (bool) {
        Org memory org = Org(_address, _name, _role, _key);
        roleMap[_role].add(_address);
        orgMap[_address] = org;
        parties.push(_address);
        return true;    
    }

    /// @dev Function to get the count of number of organizations to help with extraction
    /// @return length of the array containing organization addresses
    function getOrgCount() external view returns (uint) {
        return parties.length;
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
