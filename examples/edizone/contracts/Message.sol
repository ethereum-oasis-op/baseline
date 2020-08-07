// SPDX-License-Identifier: MPL-2.0
// SPDXVersion: SPDX-2.2
// SPDX-FileCopyrightText: Copyright 2020 FreightTrust and Clearing Corporation
// This Source Code Form is subject to the terms of the Mozilla Public
//  License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/. 
pragma solidity >=0.4.22 <0.6.0;

// This contract does not work 
// Future implementation planning 


contract Message {
	address public registrar;	
	address public from;
	address public to;
	string public hash_msg;
	string public hash_ack;
	uint256 public timestamp_msg;
	uint256 public timestamp_ack;
	
	
	function Message(address _registrar,address _from,address _to,string _hash_msg) {
		registrar=_registrar;
		from=_from;
		to=_to;
		hash_msg=_hash_msg;
		timestamp_msg=now;
	}
	
	function ack(string _hash) {
		if(msg.sender!=to) throw;
		if(timestamp_ack>0) throw;
		hash_ack=_hash;
		timestamp_ack=now;		
	}
	
	function() {
		if(msg.value>0) {
			if(msg.sender==from) {			
				to.send(msg.value);
			} else {
				from.send(msg.value);
			}
		}
	}
	
}
