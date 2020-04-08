const fs = require('fs');
const assert = require('assert');
const ethers = require('ethers');

class RadishPathKeystoreDirResolver {

	constructor(keystoreDir, provider) {
		if(typeof keystoreDir === 'undefined') {
			throw new Error('Keystore directory not supplied');
		}
		this.keystoreDir = keystoreDir;
		this.provider = provider;
		this.cachedWallets = {}
	}

	/* 
		This method will work with file named ${role}.eth in the keystore directory. 
		The file needs to have structure of { signingKey : { privateKey: "0x..."}}
	*/
	async getWallet(role) {
		if(typeof this.cachedWallets[role] !== 'undefined') {
			return this.cachedWallets[role];
		}
		const walletFilePath = `${this.keystoreDir}/${role}.eth`;
		assert(fs.existsSync(walletFilePath), `The desired wallet does not exist at ${walletFilePath}`);
		const walletJSON = JSON.parse(fs.readFileSync(walletFilePath));
		const result = new ethers.Wallet(walletJSON.signingKey.privateKey, this.provider);
		this.cachedWallets[role] = result;
		return this.cachedWallets[role];
	}

}

module.exports = RadishPathKeystoreDirResolver