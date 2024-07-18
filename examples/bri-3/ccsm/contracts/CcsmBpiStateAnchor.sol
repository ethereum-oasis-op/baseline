//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import '@openzeppelin/contracts/access/AccessControl.sol';

contract CcsmBpiStateAnchor is AccessControl {
  mapping(string => string) public anchorHashStore;
  event AnchorHashSet(string indexed workstepInstanceId, string anchorHash);

  bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');

  constructor(address[] memory admins) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // Grant deployer the default admin role

    for (uint i = 0; i < admins.length; i++) {
      _grantRole(ADMIN_ROLE, admins[i]); // Grant admin role to each address
    }
  }

  function setAnchorHash(
    string calldata _workstepInstanceId,
    string calldata _anchorHash
  ) external onlyAdmin {
    require(
      bytes(_workstepInstanceId).length > 0,
      'WorkstepInstanceId cannot be empty'
    );
    require(
      bytes(_workstepInstanceId).length < 36,
      'WorkstepInstanceId cannot exceed 36 bytes'
    );
    require(bytes(_anchorHash).length > 0, 'AnchorHash cannot be empty');
    require(
      bytes(_anchorHash).length <= 256,
      'AnchorHash cannot exceed 256 bytes'
    );

    anchorHashStore[_workstepInstanceId] = _anchorHash;

    emit AnchorHashSet(_workstepInstanceId, _anchorHash);
  }

  function getAnchorHash(
    string calldata _workstepInstanceId
  ) external view returns (string memory) {
    return anchorHashStore[_workstepInstanceId];
  }

  modifier onlyAdmin() {
    require(
      hasRole(ADMIN_ROLE, msg.sender),
      'Only admin can call this function'
    );
    _;
  }
}
