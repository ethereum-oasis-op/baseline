/* (C) 2020 - FreightTrust and Clearing Corporation
 * SPDX: MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

require("./freightlayer.js");

var forge = require('node-forge');
var fs = require("fs");

var sendSempahore=false;

sendFile = function(fname,recipient) {
	if(!sendSempahore) {
		sendSempahore=true;
		var data = fs.readFileSync("out/"+fname).toString();
		var msg = {
				filename:fname,
				data:forge.util.encode64(data)
		
		};
		freightlayer.sendData(recipient,JSON.stringify(msg),function(tx,hash) {				
					if(fs.existsSync("out/"+fname)) {
						fs.renameSync("out/"+fname,"sent/"+tx+"_"+hash+".edi");		
					}
					sendSempahore=false;
		});
	}
}

checkOutbox = function() {
	if(!fs.existsSync("out")) fs.mkdirSync("out");
	if(!fs.existsSync("sent")) fs.mkdirSync("sent");
	var files = fs.readdirSync("out");
	if(files.length==0) return;
	for(var i=0;((i<10)&&(i<files.length));i++) {
		if((files[i].indexOf(".")>2)&&(!sendSempahore)) {
			var data = fs.readFileSync("out/"+files[i]).toString();
		// try to determine "to" from data, we can parse message headers or MIME 
		
			var recipient="unknown";
			if(files[i].indexOf(".edi")>0) {
				// determine recipient from EDIFACT/X12
				var segSplit=data.substr(4,1);
				var unb_start=data.indexOf("UNB"+segSplit);
				for(var j=0;j<3;j++) {
					unb_start=data.indexOf(segSplit,unb_start+1);
				}
				var recipient_end=data.indexOf(segSplit,unb_start+1);
				recipient=data.substr(unb_start+1,recipient_end-unb_start-1);	
			} else {
				// @dev - we use `filename` to determine recipient, less overheader
				recipient=files[i].substring(0,files[i].indexOf("."));					
			}
			if(!sendSempahore) {
			sendFile(files[i],recipient);
			console.log("Outbox:",recipient);
			}		
		}
	}
}

freightlayer.storeMessage=function(message) {
	// Need to overwrite in case something goes wrong with message decryption.
	
	if(!message.data) {} else
	if(message.data.length>0) {
		var m = {};
		var json = message.data.substr(0,message.data.lastIndexOf("}")+1);
		try {
			m = JSON.parse(json);						
		} catch(e) {console.log(e);}
		if(m.filename) {
			fs.writeFileSync("in/edi/"+message.addr+"_"+m.filename,forge.util.decode64(m.data));
		} else 
		{
			console.log(m);
			fs.writeFileSync("in/edi/"+message.addr+".edi",forge.util.decode64(m.data));	
		}
	}
	  var m=message;
	 // m.data="";	  
	  fs.writeFileSync("in/meta/"+message.addr+".json",JSON.stringify(m));				
	//}	
} 

freightlayer.storeHash = function(hash,data) {
	if(!fs.existsSync("hash")) fs.mkdirSync("hash");
	fs.writeFileSync("hash/"+hash+".json",data);
}

var old_inbox_length=0;
checkInbox = function() {
 if(!fs.existsSync("in")) fs.mkdirSync("in");
 if(!fs.existsSync("in/meta")) fs.mkdirSync("in/meta");
 if(!fs.existsSync("in/edi")) fs.mkdirSync("in/edi");
 while(freightlayer.config.lastMsgCnt<freightlayer.updateInbox()) {
	console.log("Incoming Messages ... loading messages...",freightlayer.config.lastMsgCnt);
	
 }
}
var interval_semaphore=false;

var interval = function() {
	if(interval_semaphore) return;
	interval_semaphore=true;
		try { checkOutbox(); } catch(e) {console.log(e);}
		try { checkInbox(); } catch(e) {console.log(e);}
	interval_semaphore=false;
}
  
var cb = function() {
		//freightlayer.decryptMessageHash('########',new freightlayer.message(),this);
		freightlayer.config.lastMsgCnt=9;
		checkOutbox(); 
		try { checkInbox(); } catch(e) {console.log(e);}
		setInterval(function() {interval();},20000);
}

var echain = new freightlayer.bootstrap({bootstrap_callback:cb,ipfsPeer:'/ip4/});