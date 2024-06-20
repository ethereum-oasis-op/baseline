//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

contract Ccsm {
  mapping(string => string) public anchorHashStore;
  event AnchorHashSet(string indexed workgroupId, string anchorHash);

 function setAnchorHash(string calldata _workgroupId, string calldata _anchorHash) external {
	require(bytes(_workgroupId).length > 0, "WorkgroupId cannot be empty");
	require(bytes(_anchorHash).length > 0, "AnchorHash cannot be empty");

    	anchorHashStore[_workgroupId] = _anchorHash;

	emit AnchorHashSet(_workgroupId, _anchorHash);
  }

 function getAnchorHash(
    string calldata _workgroupId
  ) external view returns (string memory) {
    return anchorHashStore[_workgroupId];
  }  
}
