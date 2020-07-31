/*
 *
 * Copyright (c) 2020 FreightTrust and Clearing Corporation
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

Error.stackTraceLimit = Infinity;

require("./freighttrust.js");
var forge = require('node-forge');
var rpc = require('json-rpc2');
var fs = require('fs');

var rpcServer = function() {
	function receivedMessageCount(args, opt, callback) {
	  var error, result;  	   
	  result=freighttrust.getReceivedMessageCount();
	  callback(error, result);
	};
	
	function sentMessageCount(args, opt, callback) {
		var error, result;
		result=freighttrust.getSentMessageCount();
		callback(error, result);
	}
	function chainAccount(args, opt, callback) {
	  var error, result;  	   
	  result=freighttrust.config.fromAddress;
	  callback(error, result);
	};
	
	function getBalance(args, opt, callback) {
	  var error, result;  	   
	  result=freighttrust.getBalance();
	  callback(error, result);
	};
	function getMessageByNumber(args, opt, callback) {
	  var error, result;
	  var reload=false;
	  if(args.length>1) reload=true;
	  callback(error,freighttrust.getMessageByNumber(args[0],reload));
	};	
	function getSentByNumber(args, opt, callback) {
	  var error, result;  	
		var reload=false;
	  if(args.length>1) reload=true;	  	 
	  callback(error,freighttrust.getSentByNumber(args[0],reload));
	};		
	function decryptMessageByNumber(para, opt, callback) {
	  var error, result;  	   
	  result=freighttrust.decryptMessageByNumber(para[0]);
	  callback(error,result);  
	};	
	function decryptSentByNumber(para, opt, callback) {
	  var error, result;  	   
	  result=freighttrust.decryptSentByNumber(para[0]);
	  callback(error,result);  
	};	
	function ackMessageByAddr(para,opt,callback) {
		var error, result;  	
		try {
			freighttrust.ackMessageByAddr(para[0],para[1],function() {
				callback(error,result);			
			});
		} catch(e) {error=e;callback(error,result);}	
	};
	
	function getAck(para,opt,callback) {
		var error, result;	
		result=freighttrust.getAck(para[0],para[1]);
		callback(error,result);	
	}
	
	function getTx(para,opt,callback) {
		var error, result;	
		result=freighttrust.getTx(para[0]);
		callback(error,result);	
	}
	
	function getSentAddrs(para,opt,callback) {
		var error, result;	
		result=freighttrust.getSentAddrs();
		callback(error,result);	
	}
	
	function getMesssageAddrs(para,opt,callback) {
		var error, result;	
		result=freighttrust.getMesssageAddrs();
		callback(error,result);	
	}
	
	function getTxLog(para,opt,callback) {
		var error, result;
		freighttrust.getTxLog(function(r) {
			callback(error,r);	
		});
	}
	
	
 
	function sendEdi(para, opt, callback) {
	  var error, result;  	   
	 var recipient="unknown";		
		var data=para[0];
		if(para.length==1) {				
				// determine recipient from EDIFACT
				var segSplit=data.substr(4,1);
				var unb_start=data.indexOf("UNB"+segSplit);
				for(var j=0;j<3;j++) {
					unb_start=data.indexOf(segSplit,unb_start+1);
				}
				var recipient_end=data.indexOf(segSplit,unb_start+1);
				recipient=data.substr(unb_start+1,recipient_end-unb_start-1);	
			} else {
				// determine recipient from filename
				recipient=para[1];					
			}
		var msg = {
			filename:'adhoc',
			data:forge.util.encode64(data)		
		}
		freighttrust.sendData(recipient,JSON.stringify(msg),function(tx, hash) {
					result=hash;
					callback(error,result);  			
		})
	};	
	
		if(server) {
			try {server.close();
			} catch(e) {
						
			}		
		}
		
		var server = rpc.Server.$create({
			'websocket': true, // is true by default
			'headers': { // allow custom headers is empty by default
				'Access-Control-Allow-Origin': '*'
			}
		});

		server.expose('freighttrust',{
			'sendEdi':sendEdi,
			'receivedMessageCount':receivedMessageCount,		
			'sentMessageCount':sentMessageCount,
			'decryptMessageByNumber':decryptMessageByNumber,
			'decryptSentByNumber':decryptSentByNumber,
			'getMessageByNumber':getMessageByNumber,
			'getSentByNumber':getSentByNumber,
			'chainAccount':chainAccount,
			'ackMessageByAddr':ackMessageByAddr,
			'getTxLog':getTxLog,
			'getAck':getAck,
			'getBalance':getBalance,
			'getTx':getTx,
			'getSentAddrs':getSentAddrs,
			'getMesssageAddrs':getMesssageAddrs
			
		});	
		try {
		server.listen(8000, '0.0.0.0');
		} catch(e)  {
			console.log(e);
		}
		try {
				
		var c = freighttrust.getReceivedMessageCount();
		/*
		@dev optimization for down the line 
		console.log("Preload some cache data..");	
		for(var i=c-1;((i>=0)&&(i>c-3));i--) {
			freighttrust.getMessageByNumber(i);
		}
		*/
		console.log("ENABLED RPC: Access through http://localhost:8000");
		console.log("ERROR: NOT FOUND");
		//var tx=freighttrust.getTx("");
		} catch(e) {
			console.log("Backend Trapped",e);
		}
		setInterval(function() { freighttrust.init2() },8640000);
	
}
var config = {};

try {
	config=JSON.parse(readFileSync("../../server.conf.json"));
} catch(e) {}
config.bootstrap_callback=rpcServer;
config.pfsPeer='../ip4/${IPFS_PEER}';
config.path="../../";

var echain = new freighttrust.bootstrap(config);
