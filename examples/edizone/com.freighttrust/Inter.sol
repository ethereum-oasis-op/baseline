// SPDX-License-Identifier: MPL-2.0
// SPDXVersion: SPDX-2.2
// SPDX-FileCopyrightText: Copyright 2020 FreightTrust and Clearing Corporation
// This Source Code Form is subject to the terms of the Mozilla Public
//  License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/. 

pragma solidity >=0.4.22 <0.6.0;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;       
    }

    function transferOwnership(address newOwner)  {
		if(msg.sender!=owner) throw;
        owner = newOwner;
    }
}

contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract GSIToken is owned  {
    
	/* Public variables of the token */
    string public standard = 'Token 0.1';
    string public name;
    string public symbol;
    uint8 public decimalUnits;
    uint256 public totalSupply;
	GSIToken public exchangeToken;
	
    mapping (address => bool) public frozenAccount;

    /* This generates a public event on the blockchain that will notify clients */
    event FrozenFunds(address target, bool frozen);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function GSIToken(
        uint256 initialSupply,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol,
        address centralMinter
    )  {
        if(centralMinter != 0 ) owner = centralMinter;      // Sets the owner as specified (if centralMinter is not specified the owner is msg.sender)
        balanceOf[owner] = initialSupply;                   // Give the owner all initial tokens
		totalSupply=initialSupply;
		name=_tokenName;
		decimalUnits=_decimalUnits;
		symbol=_tokenSymbol;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        if (frozenAccount[msg.sender]) throw;                // Check if frozen
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }


    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (frozenAccount[_from]) throw;                        // Check if frozen            
        if (balanceOf[_from] < _value) throw;                 // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;  // Check for overflows
        if (_value > allowance[_from][msg.sender]) throw;   // Check allowance
        balanceOf[_from] -= _value;                          // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    function mintToken(address target, uint256 mintedAmount) {
	    if(msg.sender!=owner) throw;
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, owner, mintedAmount);
        Transfer(owner, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) {
		if(msg.sender!=owner) throw;
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

	function setExchangeToken(GSIToken _exchangeToken) {
		if(msg.sender!=owner) throw;
		exchangeToken=_exchangeToken;
	}
	    
	function demintTokens(address target,uint8 amount)  {
		if(msg.sender!=owner) throw;
		if(balanceOf[target]<amount) throw;
		balanceOf[msg.sender]+=amount;
		balanceOf[target]-=amount;
		Transfer(target,owner,amount);
	}
	
    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);


    /* Allow another contract to spend some tokens in your behalf */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        tokenRecipient spender = tokenRecipient(_spender);
        spender.receiveApproval(msg.sender, _value, this, _extraData);
        return true;
    }
	
    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }
}

contract GSI is owned {
		event OracleRequest(address target);
		event MintedGreen(address target,uint256 amount);
		event MintedGrey(address target,uint256 amount);
		
		GSIToken public greenToken;
		GSIToken public greyToken;
		uint256 public requiredGas;
		uint256 public secondsBetweenReadings;
		uint8 public pricegreengrey;
		
		mapping(address=>Reading) public lastReading;
		mapping(address=>Reading) public requestReading;
		mapping(address=>uint8) public freeReadings;
		mapping(address=>string) public plz;
		mapping(address=>uint8) public oracles;
		
		struct Reading {
			uint256 timestamp;
			uint256 value;
			string zip;
		}
		
		function GSI() {
			greenToken = new GSIToken(
							0,
							'GreenPower',
							0,
							'P+',
							this
			);			
			greyToken = new GSIToken(
							0,
							'GreyPower',
							0,
							'P-',
							this
			);		
			greenToken.setExchangeToken(greyToken);
			greyToken.setExchangeToken(greenToken);
			oracles[msg.sender]=1;
		}
		
		function oracalizeReading(uint256 _reading) {
			if(msg.value<requiredGas) {  
				if(freeReadings[msg.sender]==0) throw;
				freeReadings[msg.sender]--;
			} 		
			if(_reading<lastReading[msg.sender].value) throw;
			if(_reading<requestReading[msg.sender].value) throw;
			if(now<lastReading[msg.sender].timestamp+secondsBetweenReadings) throw;			
			//lastReading[msg.sender]=requestReading[msg.sender];
			requestReading[msg.sender]=Reading(now,_reading,plz[msg.sender]);
			OracleRequest(msg.sender);
			owner.send(msg.value);
		}	
		
		function addOracle(address oracle) {
			if(msg.sender!=owner) throw;
			oracles[oracle]=1;
			
		}
		function setPlz(string _plz) {
			plz[msg.sender]=_plz;
		}
		function setReadingDelay(uint256 delay) {
			if(msg.sender!=owner) throw;
			secondsBetweenReadings=delay;
		}
		
		function assignFreeReadings(address _receiver,uint8 _count)  {
			if(oracles[msg.sender]!=1) throw;
			freeReadings[_receiver]+=_count;
		}	
		
		function mintGreen(address recipient,uint256 tokens) {
			if(oracles[msg.sender]!=1) throw;
			greenToken.mintToken(recipient, tokens);	
			MintedGreen(recipient,tokens);
		}
		
		function mintGrey(address recipient,uint256 tokens) {
			if(oracles[msg.sender]!=1) throw;	
			greyToken.mintToken(recipient, tokens);		
			MintedGrey(recipient,tokens);
		}
		
		function commitReading(address recipient) {
		  if(oracles[msg.sender]!=1) throw;
		  lastReading[recipient]=requestReading[recipient];		  
		  //owner.send(this.balance);
		}
		
		function setGreenToken(GSIToken _greenToken) {
			if(msg.sender!=owner) throw;
			greenToken=_greenToken;			
		} 
		
		function setGreyToken(GSIToken _greyToken) {
			if(msg.sender!=owner) throw;
			greyToken=_greyToken;			
		} 
		
		function setOracleGas(uint256 _requiredGas)  {
			if(msg.sender!=owner) throw;
			requiredGas=_requiredGas;
		}

		function setGreyGreenPrice(uint8 price) {
			if(msg.sender!=owner) throw;
			pricegreengrey=price;
		}
		
		function convertGreyGreen(uint8 price,uint8 amount) {
			if(price<pricegreengrey) throw;
			if(greenToken.balanceOf(msg.sender)<amount*price) throw;
			if(greyToken.balanceOf(msg.sender)<amount) throw;
			greyToken.demintTokens(msg.sender,amount);
		}
		function() {
			if(msg.value>0) {
				owner.send(this.balance);
			}
		}
}