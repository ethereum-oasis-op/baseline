var forge = require('node-forge');
var fs = require('fs');
var rsa = forge.pki.rsa;
var Web3 = require('web3');
var web3 = new Web3();
var ipfsAPI = require('ipfs-api');
var crypto = require('crypto');
var winston = require('winston');
var https = require('https');
var constants = require("constants");
var NodeRSA = require('node-rsa');

edichain = function() {};

edichain.bootstrap=function(config) {
		var c = { version:'0.0.21' };
		if(!config.ipfsAPI)  c.ipfsAPI='/ip4/127.0.0.1/tcp/5001'; else c.ipfsAPI=config.ipfsAPI;		
		if(!c.lastMsgCnt) c.lastMsgCnt=0;		
		edichain.ipfs = ipfsAPI(c.ipfsAPI);
		if(config.ipfsPeer) {
			edichain.ipfs.swarm.connect(config.ipfsPeer);
		}
		edichain.ipfs.id(function(err,res) { if(err) throw "Check if ipfs daemon is running" ; c.ipfsID=res.ID; });	
		edichain.txlog = new (winston.Logger)({
					transports: [
					  new (winston.transports.Console)(),
					  new (winston.transports.File)({ filename: 'tx.log' })
					]
				  });
		edichain.storage.log = new (winston.Logger)({
					transports: [
					  new (winston.transports.Console)(),
					  new (winston.transports.File)({ filename: 'storage.log' })
					]
		});
		if(config.bootstrap_callback) c.bootstrap_callback=config.bootstrap_callback;
		if(config.rpcProvider) c.rpcProvider=config.rpcProvider; else c.rpcProvider='http://localhost:8545';		
		if(config.path) c.path=config.path; else c.path="./";		
		edichain.config=c;
		try {
		    this.loadKeys();
		} catch(e) {			
			this.createNewKeypair(); 
		}
		web3.setProvider(new web3.providers.HttpProvider(c.rpcProvider));
		if(fs.existsSync('registrar.abi')&&fs.existsSync('message.abi')) {
			c.registrarAbi=JSON.parse(fs.readFileSync('registrar.abi',{encoding:"utf-8"}));
			c.messageAbi=JSON.parse(fs.readFileSync('message.abi',{encoding:"utf-8"}));
		} else {
			edichain.retrieveABI();
		}

		if(config.pubRegistrarAddress) c.pubRegistrarAddress=config.pubRegistrarAddress; else c.pubRegistrarAddress="0x5b2fF75d7EaA47Db475707DAE12A688102ef4290";
		try {
			web3.eth.accounts.length;
		} catch(e) {throw "EDIchain Error:\n\rPlease check if geth is running. You might try 'geth --rpc --rpcapi \"eth,net,web3,personal\" --rpcaddr \"localhost\"  --rpcport \"8545\"'\n\r\n\r"}
		if(config.fromAddress) c.fromAddress=config.fromAddress; else { 
				if(web3.eth.accounts.length==0) {
						web3.personal.newAccount(c.pubRegistrarAddress.substr(5,19));
				} 
				c.fromAddress=web3.eth.accounts[0]; 		
		}
		if(config.pwd) { web3.personal.unlockAccount(c.fromAddress, config.pwd, 86400); c.pwd=config.pwd;} else {
			try {
			web3.personal.unlockAccount(c.fromAddress,c.pubRegistrarAddress.substr(5,19),86400);
			} catch(e) {}
		}
		this.config=c;
		this.config.fromAddress=this.config.fromAddress.toLowerCase();
		c.inboxBlock=0;
		edichain.config=c;
		c=this.config;
		console.log("Starting Account:"+c.fromAddress);
		c.bootstrap_fnct=this.ensureSync;
		c.bootstrap1=setInterval(function() {
			if(c.pem&&c.fromAddress&&edichain.config.messageAbi&&edichain.config.registrarAbi) {
				clearInterval(c.bootstrap1);
				c.bootstrap1=null;
				c.bootstrap_fnct(this.init2);
			} else {
			
			}
		
		},500);
}

/** Default Bucket Storage Implementation **/
edichain.storage = function() {};

edichain.storage.prefix="/ipfs/";

edichain.storage.writeObject = function(data,callback) {
	edichain.storage.log.info('add',{'data':data});
	edichain.ipfs.files.add(new Buffer(JSON.stringify(data)),function(err,res) {
			if(err) throw err;
			data.hash=res[0].path;
			edichain.storage.log.info('/add',{'data':data});
			callback(data);	
	});
};

edichain.storage.readObject = function(hash,cb) {
	edichain.storage.log.debug('read',{'hash':hash});
	edichain.ipfs.cat(hash,function(err,res) {
					if(err) { throw err; }
					var buf = ''
					  res
						.on('error', (err) => {
							//
						})
						.on('data', (data) => {
						  buf += data
						})
						.on('end', () => {
								edichain.storage.log.debug('/read',{'hash':hash});
								cb(JSON.parse(buf));
						});
	});
};

edichain.storage.keyhash = "";

edichain.bootstrap.prototype.config = {};

edichain.bootstrap.prototype.ensureSync = function(cb) {
	console.log("Bootstrap: Phase1 finished");
	console.log("Waiting for Blockchain");	
	var bootstrapSync=setInterval(function() {
		var sync  = web3.eth.syncing;
		if(sync==false) {
			console.log(web3.eth.defaultBlock);
			if(web3.eth.defaultBlock=="latest") {
				sync = {
					currentBlock:1000,
					highestBlock:1000					
				}
			}
		}
		if(sync.currentBlock>sync.highestBlock-10000) {
			clearInterval(bootstrapSync);
			bootstrap1=null;
			edichain.init2();
		} else {
			console.log("Sync Blockchain:"+sync.currentBlock+"/"+sync.highestBlock);
		}
			
	},10000);
}

edichain.init2 = function() {
	console.log("Bootstrap: Blockchain synced");
	var usertRegistration = function() {
		
		edichain.storage.writeObject({pubkey:edichain.config.pem_data},function(data) {
				try {				
					web3.personal.unlockAccount(edichain.config.fromAddress,edichain.config.pubRegistrarAddress.substr(5,19),8640000);			
					edichain.register(data.hash);
				} catch(e) { // Subject to fail on new - unloaded accounts 
				}
				edichain.config.ipnsKeyPublished=true;
		});
		
	}
	edichain.config.registrarContract=web3.eth.contract(edichain.config.registrarAbi).at(edichain.config.pubRegistrarAddress);		
	var pem_hash = edichain.config.registrarContract.regadr(edichain.config.fromAddress)[1];	
	if(pem_hash.length>4) {
		edichain.storage.readObject(pem_hash,function(data) {				
				if(data.pubkey==edichain.config.pem_data) {
						edichain.config.ipnsKeyPublished=true;
				} else {
					usertRegistration();
				}
		});
	} else {
		usertRegistration();
	}
	
	c=setInterval(function() {
		if(edichain.config.ipnsKeyPublished) {
			clearInterval(c);
			edichain.config.bootstrap_finished=true;
			console.log("Bootstrap: Phase2 finished");
			// we have a working config... so write to disc
			fs.writeFileSync("config", JSON.stringify(edichain.config));
			if(edichain.config.bootstrap_callback) edichain.config.bootstrap_callback();
		}
	},500);	
	// Check if we are registered - if not advice	
}

edichain.bootstrap.prototype.loadKeys=function() {
		edichain.config.pem_data=fs.readFileSync(edichain.config.path+'pub.pem',{encoding:"utf-8"});
		edichain.config.pem = forge.pki.publicKeyFromPem(edichain.config.pem_data);	
		this.config.pem=this.pem;
		
		edichain.config.pom_data=fs.readFileSync(edichain.config.path+'priv.pem',{encoding:"utf-8"});
		edichain.config.pom = forge.pki.privateKeyFromPem(edichain.config.pom_data);
	
		console.log("Loaded keys...");
	};
	
edichain.bootstrap.prototype.createNewKeypair=function() {
		var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
		edichain.config.pem=keypair.publicKey;
		edichain.config.pom=keypair.privateKey;
		edichain.config.pem_data = forge.pki.publicKeyToPem(keypair.publicKey);
		edichain.config.pom_data = forge.pki.privateKeyToPem(keypair.privateKey);
		//console.log(edichain.config.pem_data);
		
		fs.writeFile(edichain.config.path+"pub.pem", forge.pki.publicKeyToPem(keypair.publicKey), function(err) {    
			console.log("Public Key saved (filesystem)");
		}); 

		fs.writeFile(edichain.config.path+"priv.pem", forge.pki.privateKeyToPem(keypair.privateKey), function(err) {    
			console.log("Private Key saved (filesystem)");
		}); 
};

edichain.getBalance = function() {
		return web3.eth.getBalance(edichain.config.fromAddress);
}
edichain.txs = [];

edichain.tx = function() {};

edichain.getTx = function(addr) {
	var tx=null;
	if(edichain.txs[addr]) {
		tx=edichain.txs[addr];
	} else {
		var tx = new edichain.tx();
		tx.mutable=true;
	}	
	if(!tx.mutable) return tx;
	var msg=web3.eth.contract(edichain.config.messageAbi).at(addr);	
	if(!tx.msg) {
		tx.msg={};
		tx.msg.addr=addr;
		tx.msg.from=msg.from();
		tx.msg.to=msg.to();
		tx.msg.hash_msg=msg.hash_msg();
		tx.msg.timestamp_msg=msg.timestamp_msg();
		tx.msg.hash_ack=msg.hash_ack();				
		tx.msg.timestamp_ack=msg.timestamp_ack();		
	} else {
		if(tx.msg.timestamp_ack!=msg.timestamp_ack()) {
			tx.msg.timestamp_ack=msg.timestamp_ack();
			tx.msg.hash_ack=msg.hash_ack();
		}
	}	
	tx.addr = addr;
	if(tx.msg.to==edichain.config.fromAddress) {		
		if(!edichain.message_cache[addr]) {
			edichain.storeMessage(tx.msg);		
		}
		if(!edichain.message_cache[addr].content) {
			edichain.message_cache[addr]=tx.msg;			
			edichain.decryptMessage(tx.msg);
		} else {		
			tx.msg=edichain.message_cache[addr];
		}	
		if((tx.msg.timestamp_ack>0)&&(edichain.message_cache[addr].content)) {
			tx.mutable=false;		
		}
	} else if(tx.msg.from==edichain.config.fromAddress) {
			if(tx.msg.timestamp_ack>0) {			
				if(!edichain.message_sent[addr]) {
						edichain.storeSent(tx.msg);						
				}
				if(!edichain.message_sent[addr].aperak) {
					edichain.message_sent[addr]=tx.msg;								
					edichain.decryptAck(tx.msg);
				} else {		
					tx.msg.aperak=edichain.message_sent[addr].aperak;
					tx.mutable=false;
				}				
			}
	}	
	
	edichain.txs[addr]=tx;
	return tx;
}	
edichain.sendData = function(to,data,cb) {
 
	var sendDataWithPubKey=function(to_key) {
		try {
		const hmac = crypto.createHmac('sha256', to.toLowerCase());
		hmac.update(edichain.config.pubRegistrarAddress.toLowerCase());		
		var hmac_digest=hmac.digest('base64');

		var cipher = crypto.createCipher('aes192', hmac_digest);

		var encrypted = cipher.update(data, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		var pubkey = forge.pki.publicKeyFromPem(to_key);
		//var enc_hmac_digest= forge.util.encode64(pubkey.encrypt(hmac_digest,'RSA-OAEP'));
		//var enc_hmac_digest = crypto.publicEncrypt({key:to_key,padding:constants.RSA_PKCS1_PADDING}, new Buffer(hmac_digest));
		//var enc_hmac_from=edichain.config.pom.encrypt(new Buffer(hmac_digest));
		var key = new NodeRSA(to_key);			
		var enc_hmac_digest = key.encrypt(hmac_digest,'base64');
		
		var enc_hmac_from = crypto.privateEncrypt({key:edichain.config.pom_data,padding:constants.RSA_PKCS1_PADDING}, new Buffer(hmac_digest));
		
		var enc_data = {
			hmac_digest:enc_hmac_digest.toString('base64'),
			hmac_from:enc_hmac_from.toString('base64'),
			data:encrypted
			};
		
		edichain.storage.writeObject(enc_data,function(obj) {
			edichain.sendMsg(to.toLowerCase(),obj.hash,cb);					
		});
		
		} catch(e) {console.log("Error sendDataWithPubKey",e);}
	};	
	
	edichain.getPubKey(to,sendDataWithPubKey);
		

};

edichain.getSentAddrs=function() {

var msgs=[];
var i=0;
	do {
			msg_addr = edichain.config.registrarContract.sent(edichain.config.fromAddress,i++);
			if(msg_addr.length>3) msgs.push(msg_addr);
	} while(msg_addr.length>3);

return msgs;

}

edichain.getMesssageAddrs=function() {

var msgs=[];
var i=0;
	do {
			msg_addr = edichain.config.registrarContract.msgs(edichain.config.fromAddress,i++);
			if(msg_addr.length>3) msgs.push(msg_addr);
	} while(msg_addr.length>3);

return msgs;

}
// Blockchain synced get Message Address by Storage Hash
edichain.getMessageByHash = function(hash) {
	var msg=null;
	i=0;
	do {
		msg_addr = edichain.config.registrarContract.sent(edichain.config.fromAddress,i++);
		var msg = web3.eth.contract(edichain.config.messageAbi).at(msg_addr);
		if((msg.hash_msg()==hash)||(msg.hash_ack()==hash)) {			
			return msg_addr;
		}		
	} while(msg_addr.length>3);
	do {
		msg_addr = edichain.config.registrarContract.msgs(edichain.config.fromAddress,i++);
		var msg = web3.eth.contract(edichain.config.messageAbi).at(msg_addr);
		if((msg.hash_msg()==hash)||(msg.hash_ack()==hash)) {			
			return msg_addr;
		}
	} while(msg_addr.length>3);
	
	return null;
}

edichain.sendMsg = function(to,hash,cb) {
		edichain.config.registrarContract.sendMsg(to,hash,{from:edichain.config.fromAddress,gas: 1000000,value:edichain.config.registrarContract.fee_msg()},function(error, result){
			if(!error) {				
				edichain.txlog.info('sendMsg',{'result':result,'to':to,'hash':hash});
				if(cb) {
					//console.log("TX Msg contract:",edichain.getMessageByHash(hash));
					cb(result,hash);
				}
				}
			else
				console.error(error);
		});	
};

edichain.decryptMessageHash = function(hash,message,cb) {
        var ret=false;
		edichain.storage.readObject(hash,function(m) {										
					if((m.data)&&(m.hmac_digest)) {
						try {	
						   var enc_hmac_digest = new Buffer(m.hmac_digest,'base64');		
							// RSA_PKCS1_PADDING
							//
							var dec_hmac_digest ="";
							
						   try { dec_hmac_digest = crypto.privateDecrypt({key:edichain.config.pom_data,padding: constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest); } catch(e) {}
						   if(dec_hmac_digest=="") {try { dec_hmac_digest = crypto.privateDecrypt({key:edichain.config.pom_data,padding: constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest); } catch(e) {}}
						   if(dec_hmac_digest=="") {try { dec_hmac_digest = crypto.privateDecrypt({key:edichain.config.pom_data,padding: constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest); } catch(e) {}}
						   
						   if(dec_hmac_digest=="") {try { 
						   dec_hmac_digest = edichain.config.pom.decrypt(forge.util.decode64(enc_hmac_digest),'RSA-OAEP'); } catch(e) {}}
						   
						   if(dec_hmac_digest=="") {try { 
						   var key = new NodeRSA(edichain.config.pom_data);
						   
						   dec_hmac_digest = key.decrypt(enc_hmac_digest,'utf8');
						   
						   } catch(e) {console.log(e);}}
						   
						   
						   if( dec_hmac_digest=="") throw "No PADDING FOUND";
							// Test if HMAC is correct (are we recipient?)
							const hmac = crypto.createHmac('sha256', edichain.config.fromAddress.toLowerCase());
							hmac.update(edichain.config.pubRegistrarAddress.toLowerCase());
							var hmac_digest=hmac.digest('base64');

							if(hmac_digest!=dec_hmac_digest.toString()) {
								console.log("Message routing error - message hash conflict");
							} 

							var  decipher = crypto.createDecipher('aes192', dec_hmac_digest.toString());
							decipher.setAutoPadding(false);
							var decrypted = decipher.update(new Buffer(m.data,'base64'), 'hex', 'utf8');
							decrypted += decipher.final('utf8');
							if(message) {
								message.content=decrypted;
								message.hmac_digest=m.hmac_digest;
								message.hmac_from=m.hmac_from;
								if(cb) {
									cb(message);
								}
							} else  {console.log("No Message Object");}	
						} catch(e) {console.log("Decryption Warning:",e);}									
					} else { 
						console.log("Message cryption warning!");	
						m.content="";
						message.content="";
						//cb(m);
						cb(message);
					}
			});
				
}

edichain.decryptSentHash = function(hash,message,cb) {
        var ret=false;
		edichain.storage.readObject(hash,function(m) {										
					if((m.data)&&(m.hmac_digest)) {
						try {	
						   var enc_hmac_digest = new Buffer(m.hmac_digest,'base64');		
							// RSA_PKCS1_PADDING
							//
							var dec_hmac_digest ="";
							
						   try { dec_hmac_digest = crypto.privateDecrypt({key:edichain.config.pom_data,padding: constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest); } catch(e) {}
						   if(dec_hmac_digest=="") {try { dec_hmac_digest = crypto.privateDecrypt({key:edichain.config.pom_data,padding: constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest); } catch(e) {}}
						   if(dec_hmac_digest=="") {try { dec_hmac_digest = crypto.privateDecrypt({key:edichain.config.pom_data,padding: constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest); } catch(e) {}}
						   
						   if(dec_hmac_digest=="") {try { 
						   dec_hmac_digest = edichain.config.pom.decrypt(forge.util.decode64(enc_hmac_digest),'RSA-OAEP'); } catch(e) {}}
						   
						   if(dec_hmac_digest=="") {try { 
						   var key = new NodeRSA(edichain.config.pom_data);
						   
						   dec_hmac_digest = key.decrypt(enc_hmac_digest,'utf8');
						   
						   } catch(e) {console.log(e);}}
						   
						   
						   if( dec_hmac_digest=="") throw "No PADDING FOUND";
							// Test if HMAC is correct (are we recipient?)
							const hmac = crypto.createHmac('sha256', edichain.config.fromAddress.toLowerCase());
							hmac.update(edichain.config.pubRegistrarAddress.toLowerCase());
							var hmac_digest=hmac.digest('base64');

							if(hmac_digest!=dec_hmac_digest.toString()) {
								console.log("Message routing error - message hash conflict");
							} 

							var  decipher = crypto.createDecipher('aes192', dec_hmac_digest.toString());
							decipher.setAutoPadding(false);
							var decrypted = decipher.update(new Buffer(m.data,'base64'), 'hex', 'utf8');
							decrypted += decipher.final('utf8');
							if(message) {
								message.aperak=decrypted;
								//message.hmac_digest=m.hmac_digest;
								//message.hmac_from=m.hmac_from;
								if(cb) {
									cb(message);
								}
							} else  {console.log("No Message Object");}	
						} catch(e) {console.log("Decryption Warning:",e);}									
					} else { 
						console.log("ACK cryption warning!");	
						m.aperak="";
						message.aperak="";
						//cb(m);
						cb(message);
					}
			});
				
}


edichain.verifySender = function(message,cb) {		
		var verifyWithKey = function(pubKey) {
			var enc_hmac_digest = new Buffer(message.hmac_from,'base64');
			var dec_hmac_digest = "";
			try {
			 dec_hmac_digest = crypto.publicDecrypt({key:pubKey,padding:constants.RSA_PKCS1_NO_PADDING},enc_hmac_digest).toString();
		    } catch(e) {console.log(e,enc_hmac_digest,pubKey);}
								   
			// Test if HMAC is correct (are we recipient?)
			const hmac = crypto.createHmac('sha256', edichain.config.fromAddress.toLowerCase());
			hmac.update(edichain.config.pubRegistrarAddress.toLowerCase());
			var hmac_digest=hmac.digest('base64');
			if(hmac_digest==dec_hmac_digest) { 
					message.verifiedSender=true;
			} else { 					
					message.verifiedSender=false;	
			}		
			if(cb) cb(message);
		}
		try {
			edichain.getPubKey(message.from,verifyWithKey);
		} catch(e) {
			message.err=e;
			edichain.storeMessage(message);
		}
};

edichain.storeMessage = function(message) { 
	edichain.message_cache[message.addr]=message;
};

edichain.storeSent = function(message) { 
	edichain.message_sent[message.addr]=message;
};


edichain.storeHash = function(hash,data) {};
edichain.decryptMessage = function(message) {				
	edichain.storeMessage(message);
	try {
			console.log("Decrypt",message.hash_msg);
			edichain.decryptMessageHash(message.hash_msg,message,function(m) {
				try {
							edichain.storeMessage(m);
							var json = m.content.substr(0,m.content.lastIndexOf("}")+1);
							m.content=JSON.parse(json);
							m.content.edi=forge.util.decode64(m.content.data);
							edichain.verifySender(m,function(m) {			
								try 
								{
										if(m.hash_ack.length<2) {
											//edichain.ackMessage(m,JSON.stringify(m.hash_msg));
										}

										console.log(json,m);
										edichain.storeMessage(m);
								} catch(e) {
									m.err=e;
									edichain.storeMessage(m);			 
								}										
							});	
				} catch(e) {
					m.err=e;
					edichain.storeMessage(m);			 
				}
			 });
	 } catch(e) {
	 message.err=e;
	 edichain.storeMessage(message);			 
	 }
};
edichain.decryptAck = function(message) {	
	console.log("storeSent",message);
	edichain.storeSent(message);
	try {
			
			edichain.decryptSentHash(message.hash_ack,message,function(m) {
				try {							
							edichain.storeSent(m);
							//var json = m.data.substr(0,m.data.lastIndexOf("}")+1);
							//m.aperak=JSON.parse(json);
							//m.aperak.edi=forge.util.decode64(m.aperak.data);
							
				} catch(e) {
					m.err=e;
					edichain.storeSent(m);			 
				}
			 });
	 } catch(e) {
	 message.err=e;
	 edichain.storeSent(message);			 
	 }
};
edichain.ackMessageByAddr = function(addr,payload,cb) {
	if(edichain.message_cache[addr]) {
	 var ackm=edichain.message_cache[addr];
	 var sendDataWithPubKey=function(to_key) {

		try {
		const hmac = crypto.createHmac('sha256', ackm.from.toLowerCase());
		hmac.update(edichain.config.pubRegistrarAddress.toLowerCase());		
		var hmac_digest=hmac.digest('base64');

		var cipher = crypto.createCipher('aes192', hmac_digest);

		var encrypted = cipher.update(payload, 'utf8', 'base64');
		encrypted += cipher.final('base64');
		var pubkey = forge.pki.publicKeyFromPem(to_key);
		var key = new NodeRSA(to_key);			
		var enc_hmac_digest = key.encrypt(hmac_digest,'base64');
		
		var enc_hmac_from = crypto.privateEncrypt({key:edichain.config.pom_data,padding:constants.RSA_PKCS1_PADDING}, new Buffer(hmac_digest));
		
		var enc_data = {
			hmac_digest:enc_hmac_digest.toString('base64'),
			hmac_from:enc_hmac_from.toString('base64'),
			data:encrypted
			};
		
		edichain.storage.writeObject(enc_data,function(obj) {
			edichain.sendAckMessage(ackm.addr.toLowerCase(),obj.hash);					
		});
		
		} catch(e) {console.log("Error sendDataWithPubKey",e);}
	};	
	
	edichain.getPubKey(ackm.from,sendDataWithPubKey);
		
	} else throw "Message not found for ACK";
};

edichain.ackMessage = function(message,payload_string) {				
		
		const hmac = crypto.createHmac('sha256', message.from.toLowerCase());
		hmac.update(edichain.config.pubRegistrarAddress.toLowerCase());		
		var hmac_digest=hmac.digest('base64');

		var cipher = crypto.createCipher('aes192', hmac_digest);

		var encrypted = cipher.update(payload_string, 'utf8', 'base64');
		encrypted += cipher.final('base64');

		var enc_hmac_digest = crypto.privateEncrypt(edichain.config.pom_data, new Buffer(hmac_digest));		
		
		var enc_data = {
			hmac_digest:enc_hmac_digest.toString('base64'),			
			data:encrypted
			};
		
		edichain.storage.writeObject(enc_data,function(obj) {
			edichain.sendAckMessage(message.addr,obj.hash);		
		});
}

edichain.sendAckMessage = function(addr,hash) {
			var msg = web3.eth.contract(edichain.config.messageAbi).at(addr);
			msg.ack.sendTransaction(hash,"",{from:edichain.config.fromAddress,gas: 2000000},function(error, result){
			if(!error)
				{ 
					console.log("TX Hash ACK:"+result);
					edichain.txlog.info('ackMsg',{'result':result,'addr':addr,'hash':hash});					
				}
			else
				console.error(error);
		});	
};

edichain.message = function() {};
edichain.message_cache = [];
edichain.message_sent = [];

edichain.getTxLog = function(cb) {
	var options = {	
		limit: 10,
		from:   new Date - 30*24 * 60 * 60 * 1000,	
		order: 'desc',
		fields: ['message','timestamp','result','to','hash','addr']
	  };

	  //
	  // Find items logged between today and yesterday.
	  //
	  edichain.txlog.query(options, function (err, results) {
		if (err) {
		  throw err;
		}

		cb(results);
	  });
}
edichain.getAck = function(hash,to) {
	var i=0;
	var msg_addr="";
	do {
		msg_addr = edichain.config.registrarContract.msgs(to,i++);	
		var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);
		if((msg.from()==edichain.config.fromAddress)&&(msg.hash_msg()==hash)) {
				if(msg.hash_ack().length()>2) {
							return msg;
				}					
		}				
	} while(msg_addr.length>2);
}

edichain.getSentByNumber = function(num,force_reload) {
	msg_addr = edichain.config.registrarContract.sent(edichain.config.fromAddress,num);		
	if(edichain.message_sent[msg_addr]) {
		if(edichain.message_sent[msg_addr].timestamp_ack<1) {
			force_reload=true;
		}
		if(edichain.message_sent[msg_addr].aperak) {
			force_reload=false;
		}
	}	
	if(msg_addr.length>3) if((!edichain.message_sent[msg_addr])||(force_reload)) {	
				var m = new edichain.message();	
				var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);		
				m.addr=msg_addr;
				m.from=msg.from();
				m.to=msg.to();
				m.hash_msg=msg.hash_msg();
				m.timestamp_msg=msg.timestamp_msg();
				m.hash_ack=msg.hash_ack();				
				m.timestamp_ack=msg.timestamp_ack();				
				edichain.message_sent[msg_addr]=m;				
	}
	return edichain.message_sent[msg_addr];
}

edichain.getMessageByNumber = function(num,force_reload) {
	msg_addr = edichain.config.registrarContract.msgs(edichain.config.fromAddress,num);	
	if(edichain.message_cache[msg_addr]) {
		if(edichain.message_cache[msg_addr].timestamp_ack<1) {
			force_reload=true;
		}
		if(edichain.message_cache[msg_addr].content) {
			force_reload=false;
		}
	}
	if(msg_addr.length>3) if((!edichain.message_cache[msg_addr])||force_reload) {	
				var m = new edichain.message();	
				var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);		
				m.addr=msg_addr;
				m.from=msg.from();
				m.to=msg.to();
				m.hash_msg=msg.hash_msg();
				m.timestamp_msg=msg.timestamp_msg();
				m.hash_ack=msg.hash_ack();				
				m.timestamp_ack=msg.timestamp_ack();				
				edichain.message_cache[msg_addr]=m;				
	}
	return edichain.message_cache[msg_addr];
}

edichain.decryptMessageByAddress=function(addr) {
	edichain.decryptMessage(edichain.message_cache[addr]);
}

edichain.decryptMessageByNumber=function(num) {
	msg_addr = edichain.config.registrarContract.msgs(edichain.config.fromAddress,num);		
	if(msg_addr.length>3) if(!edichain.message_cache[msg_addr]) {	
				var m = new edichain.message();	
				var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);		
				m.addr=msg_addr;
				m.from=msg.from();
				m.to=msg.to();
				m.hash_msg=msg.hash_msg();
				m.timestamp_msg=msg.timestamp_msg();
				m.hash_ack=msg.hash_ack();				
				m.timestamp_ack=msg.timestamp_ack();				
				edichain.message_cache[msg_addr]=m;					
	}
	if(!edichain.message_cache[msg_addr].content) {
		edichain.decryptMessage(edichain.message_cache[msg_addr]);
		return true;
	} 
	return false;
}
edichain.decryptSentByNumber=function(num) {
	msg_addr = edichain.config.registrarContract.sent(edichain.config.fromAddress,num);		
	if(msg_addr.length>3) if(!edichain.message_sent[msg_addr]) {	
				var m = new edichain.message();	
				var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);		
				m.addr=msg_addr;
				m.from=msg.from();
				m.to=msg.to();
				m.hash_msg=msg.hash_msg();
				m.timestamp_msg=msg.timestamp_msg();
				m.hash_ack=msg.hash_ack();				
				m.timestamp_ack=msg.timestamp_ack();				
				edichain.message_sent[msg_addr]=m;					
	}
	if(!edichain.message_sent[msg_addr].aperak) {
		edichain.decryptAck(edichain.message_sent[msg_addr]);
		return true;
	} 
	return false;
}

edichain.getSentMessageCount=function() {	
	var i=0;
	try {
		i=fs.readFileSync(edichain.config.path+'lastsentcnt.txt',{encoding:"utf-8"});	
	} catch(e) {}
	
	do {
		msg_addr = edichain.config.registrarContract.msgs(edichain.config.fromAddress,i++);	
		if(msg_addr.length>3) if(!edichain.message_sent[msg_addr]) {					
				var m = new edichain.message(); 
				var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);		
				m.addr=msg_addr;
				m.from=msg.from();
				m.to=msg.to();
				m.hash_msg=msg.hash_msg();
				m.timestamp_msg=msg.timestamp_msg();
				m.hash_ack=msg.hash_ack();				
				m.timestamp_ack=msg.timestamp_ack();
				m.content="";
				edichain.message_sent[msg_addr]=m;
				fs.writeFileSync(edichain.config.path+'lastsentcnt.txt',i);
		}
	} while(msg_addr.length>3) 
	i=i-1;
	return i;
};

edichain.getReceivedMessageCount=function() {	
	var i=0;
	try {
		i=fs.readFileSync(edichain.config.path+'lastmsgcnt.txt',{encoding:"utf-8"});	
	} catch(e) {}
	
	do {
		msg_addr = edichain.config.registrarContract.msgs(edichain.config.fromAddress,i++);	
		if(msg_addr.length>3) if(!edichain.message_cache[msg_addr]) {					
				var m = new edichain.message(); 
				var msg=web3.eth.contract(edichain.config.messageAbi).at(msg_addr);		
				m.addr=msg_addr;
				m.from=msg.from();
				m.to=msg.to();
				m.hash_msg=msg.hash_msg();
				m.timestamp_msg=msg.timestamp_msg();
				m.hash_ack=msg.hash_ack();				
				m.timestamp_ack=msg.timestamp_ack();
				m.content="";
				edichain.message_cache[msg_addr]=m;
				fs.writeFileSync(edichain.config.path+'lastmsgcnt.txt',i);
		}
	} while(msg_addr.length>3) 
	i=i-1;
	return i;
};


edichain.retrieveABI = function() {

	edichain.ipfs.cat("QmTawf3PqWxejNj8bECDAeja8FdCK25Kj3VfwKMKfNNvfE",function(err,res) {	
		if(err) { console.log(err); throw "Unable to retrieve message.abi via IPFS (maybe try to copy file to root folder)"; }
		var buf = ''
					  res
						.on('error', (err) => {
							//
						})
						.on('data', (data) => {
						  buf += data
						})
						.on('end', () => {
							fs.writeFileSync("message.abi", buf);
							edichain.config.messageAbi=JSON.parse(buf);
						});
	});
	
	edichain.ipfs.cat("QmfYDth3f5MqypZ45JUKjVN48g4xi5DHttfTh6wCfstwXJ",function(err,res) {		
		if(err) { console.log(err); throw "Unable to retrieve registrar.abi via IPFS (maybe try to copy file to root folder)"; }
		var buf = ''
					  res
						.on('error', (err) => {
							//
						})
						.on('data', (data) => {
						  buf += data
						})
						.on('end', () => {
							fs.writeFileSync("registrar.abi", buf);
							edichain.config.registrarAbi=JSON.parse(buf);
						});
	});
}

edichain.getPubKey = function(address,callback) {
		var reg=edichain.config.registrarContract.regadr(address);
		if(reg[1].length<5) throw "Address "+address+" not registered at "+edichain.config.pubRegistrarAddress;
		var hash=reg[1];
		console.log(hash);
		edichain.storage.readObject(hash,function(obj) {callback(obj.pubkey);});
};

edichain.register = function(pemID) {
		edichain.config.registrarContract.updateRegistration.sendTransaction(""+pemID+"","",{from:edichain.config.fromAddress,gas: 2000000,value:edichain.config.registrarContract.fee_registration()},function(error, result){
			if(!error)
				{ 
					console.log("TX Hash Registration:"+result);
					edichain.txlog.info('register',{'result':result,'pemID':pemID});
					edichain.sendMsg(edichain.config.registrarContract.registrar(),""+edichain.storage.prefix+""+pemID+"");
				}
			else
				console.error(error);
		});	
		console.log("Registering Contract");
};
	
module.exports=edichain;	