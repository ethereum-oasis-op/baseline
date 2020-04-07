const fs = require('fs');
const assert = require('assert');
const ethers = require('ethers');

class RadishPathKeystoreResolver {

	constructor(keystoreDir) {
		if(typeof keystoreDir === 'undefined') {
			throw new Error('Keystore directory not supplied');
		}
		this.keystoreDir = keystoreDir;
	}

	/* 
		This method will work with file named ${role}.eth in the keystore directory. 
		The file needs to have structure of { signingKey : { privateKey: "0x..."}}
	*/
	getWallet(role) {
		const walletFilePath = `${this.keystoreDir}/${role}.eth`;
		assert(fs.existsSync(walletFilePath), `The desired wallet does not exist at ${walletFilePath}`);
		const walletJSON = JSON.parse(fs.readFileSync(walletFilePath));
		return new ethers.Wallet(walletJSON.signingKey.privateKey);
	}

}

module.exports = RadishPathKeystoreResolver