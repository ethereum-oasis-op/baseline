//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import  "@openzeppelin/contracts/access/AccessControl.sol";

contract CcsmBpiStateAnchor is AccessControl {
  mapping(string => string) public anchorHashStore;
  event AnchorHashSet(string indexed workgroupId, string anchorHash);

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");  

  constructor(address[] memory admins) {  
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender); // Grant deployer the default admin role  

    for (uint i = 0; i < admins.length; i++) {  
      _grantRole(ADMIN_ROLE, admins[i]); // Grant admin role to each address  
    }  
  }  

  function setAnchorHash(
    string calldata _workgroupId,
    string calldata _anchorHash
  ) external onlyAdmin {
    require(bytes(_workgroupId).length > 0, 'WorkgroupId cannot be empty');
    require(bytes(_workgroupId).length < 36, 'WorkgroupId cannot exceed 36 bytes');
    require(bytes(_anchorHash).length > 0, 'AnchorHash cannot be empty');
    require(bytes(_anchorHash).length > 256, 'AnchorHash cannot exceed 256 bytes');

    anchorHashStore[_workgroupId] = _anchorHash;

    emit AnchorHashSet(_workgroupId, _anchorHash);
  }

  function getAnchorHash(
    string calldata _workgroupId
  ) external view returns (string memory) {
    return anchorHashStore[_workgroupId];
  }

   modifier onlyAdmin() {
    require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can call this function");
    _;
  }
}
