// SPDX-License-Identifier: CC0
pragma solidity ^0.6.9;

import "./ERC1820ImplementerInterface.sol";

contract SampleERC1820Implementer is ERC1820ImplementerInterface {

    function canImplementInterfaceForAddress(bytes32, address) external override view returns(bytes32) {
        return ERC1820_ACCEPT_MAGIC;
    }
}
