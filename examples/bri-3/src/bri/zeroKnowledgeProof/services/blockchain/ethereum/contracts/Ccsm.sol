//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract Ccsm {
  mapping(string => bool) public anchorHashStore;

  function setAnchorHash(string calldata _anchorHash) external {
    anchorHashStore[_anchorHash] = true;
  }

  function getAnchorHash(string calldata _anchorHash)
    external
    view
    returns (bool)
  {
    return anchorHashStore[_anchorHash];
  }
}
