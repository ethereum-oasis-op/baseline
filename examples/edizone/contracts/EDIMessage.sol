// SPDX-License-Identifier: MPL-2.0
// SPDXVersion: SPDX-2.2
// SPDX-FileCopyrightText: Copyright 2020 FreightTrust and Clearing Corporation
// This Source Code Form is subject to the terms of the Mozilla Public
//  License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/. 
pragma solidity >=0.4.22 <0.6.0;

contract EDIProtocol {
	// `EDIMessage` is a contract type that is defined below.
	// It is fine to reference it as long as it is not used
	// to create a new contract.
	EDIMessage creator;
	address owner;
	bytes32 ack;

	//     address public registrar;
	//     address public from;
	//     address public to;
	//     string public hash_msg;
	//     string public hash_ack;
	//     uint256 public timestamp_msg;
	//     uint256 public timestamp_ack;

	// This is the constructor which registers the
	// creator and the assigned ack.
	constructor(bytes32 _ack) public {
		// State variables are accessed via their ack
		// and not via e.g. `this.owner`. Functions can
		// be accessed directly or through `this.f`,
		// but the latter provides an external view
		// to the function. Especially in the constructor,
		// you should not access functions externally,
		// because the function does not exist yet.
		// See the next section for details.
		owner = msg.sender;

		// We do an explicit type conversion from `address`
		// to `EDIMessage` and assume that the type of
		// the calling contract is `EDIMessage`, there is
		// no real way to check that.
		creator = EDIMessage(msg.sender);
		ack = _ack;
	}

	function changeStatus(bytes32 newStatus) public {
		// Only the creator can alter the ack --
		// the comparison is possible since contracts
		// are explicitly convertible to addresses.
		if (msg.sender == address(creator))
			ack = newStatus;
	}

	function transfer(address newOwner) public {
		// Only the current owner can transfer the token.
		if (msg.sender != owner) return;

		// We ask the creator contract if the transfer
		// should proceed by using a function of the
		// `EDIMessage` contract defined below. If
		// the call fails (e.g. due to out-of-gas),
		// the execution also fails here.
		if (creator.isTokenTransferOK(owner, newOwner))
			owner = newOwner;
	}
}

contract EDIMessage {
	function createEDIFACT(bytes32 ack)
	public
	returns (EDIProtocol interchangeAddress)
	{
		// Create a new `Token` contract and return its address.
		// From the JavaScript side, the return type is
		// `address`, as this is the closest type available in
		// the ABI.
		return new EDIProtocol(ack);
	}

	function changeStatus(EDIProtocol interchangeAddress, bytes32 ack) public {
		interchangeAddress.changeStatus(ack);
	}

	// Perform checks to determine if transferring a token to the
	// `EDIProtocol` contract should proceed
	function isTokenTransferOK(address currentOwner, address newOwner)
	public
	pure
	returns (bool ok)
	{
		// Check an arbitrary condition to see if transfer should proceed
		return keccak256(abi.encodePacked(currentOwner, newOwner))[0] == 0x7f;
	}
}
