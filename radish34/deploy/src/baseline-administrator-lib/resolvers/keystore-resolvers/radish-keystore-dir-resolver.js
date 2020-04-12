const fs = require('fs');
const assert = require('assert');
const ethers = require('ethers');

/**
 * Radish specific class for resolving keystore files from a directory containing them and connecting them to blockchain network.
 */
class RadishPathKeystoreDirResolver {

	/**
	 * 
	 * @param {string} keystoreDir - The directory where keystore files will be searched for
	 * @param {ethers.Provider} provider - The ethers provider to connect to
	 */
	constructor(keystoreDir, provider) {
		if (typeof keystoreDir === 'undefined') {
			throw new Error('Keystore directory not supplied');
		}
		this.keystoreDir = keystoreDir;
		this.provider = provider;
		this.cachedWallets = {}
	}

	/** 
	 * @dev This method will work with file named ${role}.eth in the keystore directory. 
	 * The file needs to have structure of { signingKey : { privateKey: "0x..."}}
	 * @param {string} keystoreName - name of the keystore to be resolved.
	 * @returns {ethers.Signer} - signer/wallet connected to the provider
	 */
	async getWallet(keystoreName) {
		if (typeof this.cachedWallets[keystoreName] !== 'undefined') {
			return this.cachedWallets[keystoreName];
		}
		const walletFilePath = `${this.keystoreDir}/${keystoreName}.eth`;
		assert(fs.existsSync(walletFilePath), `The desired wallet does not exist at ${walletFilePath}`);
		const walletJSON = JSON.parse(fs.readFileSync(walletFilePath));
		const result = new ethers.Wallet(walletJSON.signingKey.privateKey, this.provider);
		this.cachedWallets[keystoreName] = result;
		return this.cachedWallets[keystoreName];
	}

}

module.exports = RadishPathKeystoreDirResolver