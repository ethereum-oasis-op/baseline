pragma solidity ^0.6.9;
import "@openzeppelin/contracts/introspection/ERC165.sol";

contract ERC165Compatible is ERC165 {

    constructor() public {
        setInterfaces();
    }

    function setInterfaces() virtual public returns (bool) {
        _registerInterface(this.supportsInterface.selector);
        return true;
    }
}
