pragma solidity ^0.5.0;
import "./ERC165Compatible.sol";

contract Registry is ERC165Compatible {
    address internal creator;
    enum Role {Buyer, Supplier, Carrier}

    struct Org {
        bytes32 name;
        uint role;
        bytes32 dataUri;
    }

    mapping (address => Org) orgMap;

    constructor () public ERC165Compatible() {
        creator = msg.sender;
        supportedInterfaces[this.registerOrg.selector ^
                            this.getOrg.selector] = true;
    }

    function registerOrg(address party, bytes32 _name, uint _role, bytes32 _dataUri) external {
        Org memory org = Org(_name, _role, _dataUri);
        orgMap[party] = org;
    }

    function getOrg(address party) external view returns (bytes32, bytes32) {
        return (orgMap[party].name, orgMap[party].dataUri);
    }
}
