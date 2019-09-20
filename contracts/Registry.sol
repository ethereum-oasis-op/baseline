pragma solidity ^0.5.8;
import "./ERC165Compatible.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/Roles.sol";

contract Registry is Ownable {
    using Roles for Roles.Role;

    enum Role {Null, Buyer, Supplier, Carrier}

    struct Org {
        address orgAddress;
        bytes32 name;
        uint role;
    }

    mapping (address => Org) orgMap;
    mapping (uint => Roles.Role) private roleMap;
    address[] public parties;
    // address public creator;

    constructor() internal Ownable() {
        // creator = msg.sender;
        // setInterfaces();
    }

    /* function getOwner() external view returns (address) {
        return creator;
    }

    function setInterfaces() internal onlyOwner returns (bool) {
        supportedInterfaces[this.registerOrg.selector ^
                            this.getOrgs.selector ^
                            this.getOrgs.selector] = true;
    } */

    function registerOrg(address _address, bytes32 _name, uint _role) external onlyOwner returns (bool) {
        Org memory org = Org(_address, _name, _role);
        roleMap[_role].add(_address);
        orgMap[_address] = org;
        parties.push(_address);
    }

    function getOrgCount() external view returns (uint) {
        return parties.length;
    }

    function getOrgs(uint start, uint count) external view returns (address[] memory, bytes32[] memory , uint[] memory) {
        uint end = start + count - 1;
        if (end >= parties.length) end = parties.length - 1;

        uint size = end - start + 1;
        address[] memory addresses = new address[](size);
        bytes32[] memory names = new bytes32[](size);
        uint[] memory roles = new uint[](size);

        for (uint i = 0; i < size; i++) {
            addresses[i] = addresses[i + start];
            names[i] = orgMap[addresses[i + start]].name;
            roles[i] = orgMap[addresses[i + start]].role;
        }

        return (addresses, names, roles);
    }
}
