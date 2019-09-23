pragma solidity ^0.5.8;
import "./ERC165Compatible.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";

contract Registry is Ownable, ERC165Compatible {
    using Roles for Roles.Role;

    enum Role {Null, Buyer, Supplier, Carrier}

    struct Org {
        address orgAddress;
        bytes32 name;
        uint role;
        bytes32 messagingKey;
    }

    mapping (address => Org) orgMap;
    mapping (uint => Roles.Role) private roleMap;
    address[] public parties;
    
    event OrgRegistered(address orgAddress, bytes32 orgName, uint orgRole, bytes32 orgKey);

    constructor() public Ownable() {
        // creator = msg.sender;
        setInterfaces();
    }

    function setInterfaces() public onlyOwner returns (bool) {
        supportedInterfaces[this.registerOrg.selector ^
                            this.getOrgCount.selector ^
                            this.getOrgs.selector] = true;
    }

    function getInterfaces() external view returns (bytes4) {
        return this.registerOrg.selector ^
                            this.getOrgCount.selector ^
                            this.getOrgs.selector;
    }

    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return supportedInterfaces[interfaceId];
    }

    function registerOrg(address _address, bytes32 _name, uint _role, bytes32 _key) external onlyOwner returns (bool) {
        Org memory org = Org(_address, _name, _role, _key);
        roleMap[_role].add(_address);
        orgMap[_address] = org;
        parties.push(_address);
        emit OrgRegistered(_address, _name, _role, _key);
    }

    function getOrgCount() external view returns (uint) {
        return parties.length;
    }

    function getOrgs(uint start, uint count) external view returns (address[] memory, bytes32[] memory , uint[] memory, bytes32[] memory) {
        uint end = start + count - 1;
        if (end >= parties.length) end = parties.length - 1;

        uint size = end - start + 1;
        address[] memory addresses = new address[](size);
        bytes32[] memory names = new bytes32[](size);
        uint[] memory roles = new uint[](size);
        bytes32[] memory keys = new bytes32[](size);

        for (uint i = 0; i < size; i++) {
            addresses[i] = parties[i + start];
            names[i] = orgMap[parties[i + start]].name;
            roles[i] = orgMap[parties[i + start]].role;
            keys[i] = orgMap[parties[i + start]].messagingKey;
        }

        return (addresses, names, roles, keys);
    }
}
