// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/introspection/ERC165.sol";

contract ERC165Compatible is ERC165 {

    constructor() public {
        setInterfaces();
    }

    function setInterfaces() public virtual  returns (bool) {
        _registerInterface(this.supportsInterface.selector);
        return true;
    }
}
