const assert = require('assert');
const ethers = require('ethers');

/**
 * Class for handling baseline workgroup management
 */
class BaselineWorkgroupManager {
  /**
   * @dev pass ethers contracts instances
   * @param {ethers.Contract} orgRegistryContract - instance of the OrgRegistry contract, connected to the administrator wallet
   * @param {ethers.Contract} verifierContract - instance of the Verifier contract, connected to the administrator wallet
   * @param {ethers.Contract} shieldContract - instance of the Shield contract, connected to the administrator wallet
   */
  constructor(orgRegistryContract, verifierContract, shieldContract) {
    assert(orgRegistryContract, 'orgRegistryContract was not provided');
    assert(verifierContract, 'verifierContract wallet was not provided');
    assert(shieldContract, 'shieldContract wallet was not provided');
    this.orgRegistryContract = orgRegistryContract;
    this.verifierContract = verifierContract;
    this.shieldContract = shieldContract;
  }

  /**
   * Registers an organisation with the given params into the workgroup organisation registry
   *
   * @param {address} organisationAddress - Address of the registered organisation
   * @param {string} organisationName - Name of the registered organisation
   * @param {string} organisationMessagingEndpoint - NATS endpoint of the registered organisation
   * @param {string} organisationWhisperKey - Whisper messaging key to interact with the registered organisation
   * @param {string} organisationZkpPublicKey - Zero Knowledge Proofs public key of the registered organisation
   * @param {object} organisationMetadata - Arbitrary metadata to associate with the registered organization
   * @param {object} transactionOverrides - ethers transaction overrides object to be applied to the transaction
   * @returns ethers.TransactionReceipt object
   */
  async registerOrganisation(
    organisationAddress,
    organisationName,
    organisationMessagingEndpoint,
    organisationMessagingKey,
    organisationZkpPublicKey,
    organisationMetadata,
    transactionOverrides,
  ) {
    const tx = await this.orgRegistryContract.registerOrg(
      organisationAddress,
      ethers.utils.formatBytes32String(organisationName),
      ethers.utils.toUtf8Bytes(organisationMessagingEndpoint),
      ethers.utils.toUtf8Bytes(organisationMessagingKey),
      ethers.utils.toUtf8Bytes(organisationZkpPublicKey),
      ethers.utils.toUtf8Bytes(JSON.stringify(organisationMetadata)),
      typeof transactionOverrides === 'undefined' ? {} : transactionOverrides,
    );

    return tx.wait();
  }

  /**
   * Registers organisation interface for certain group
   *
   * @param {string} groupName The name of the registered interface group
   * @param {address} tokenAddress The address of the payment token of the group
   * @param {address} shieldAddress The address for the shield contract of the group
   * @param {address} verifierAddress The address for the verifier contract of the group
   * @param {object} transactionOverrides - ethers transaction overrides object to be applied to the transaction
   * @returns ethers.TransactionReceipt object
   */
  async registerOrganisationInterfaces(
    groupName,
    tokenAddress,
    shieldAddress,
    verifierAddress,
    transactionOverrides,
  ) {
    const tx = await this.orgRegistryContract.registerInterfaces(
      ethers.utils.formatBytes32String(groupName),
      tokenAddress,
      shieldAddress,
      verifierAddress,
      typeof transactionOverrides === 'undefined' ? {} : transactionOverrides,
    );

    return tx.wait();
  }

  /**
   * Returns the number of the currently registered organisations
   *
   * @returns - the number of organisations
   */
  async getOrganisationsCount() {
    return this.orgRegistryContract.getOrgCount();
  }

  /**
   * Returns the registered information about an organisation with the given organisationAddress
   *
   * @param {address} organisationAddress - the address of the searched organisation
   * @returns the information written during the organisation registration
   */
  async getOrganisationInfo(organisationAddress) {
    const result = await this.orgRegistryContract.getOrg(organisationAddress);
    const [address, name, messagingEndpoint, messagingKey, zkpPublicKey, metadata] = result;
    return {
      address,
      name: ethers.utils.parseBytes32String(name),
      messagingEndpoint: ethers.utils.toUtf8String(messagingEndpoint),
      messagingKey: ethers.utils.toUtf8String(messagingKey),
      zkpPublicKey: ethers.utils.toUtf8String(zkpPublicKey),
      metadata: ethers.utils.toUtf8String(metadata),
      toString: function () {
        return `
Organisation Address: ${this.address}
Organisation Name: ${this.name}
Organisation MessagingEndpoint: ${this.messagingEndpoint}
Organisation MessagingKey: ${this.messagingKey}
Organisation zkpPublicKey: ${this.zkpPublicKey}
Organisation metadata: ${this.metadata}`;
      },
    };
  }

  /**
   * Registers a verification key in the shield contract.
   *
   * @param {*} vk - verification key. Probably resolved by verification key resolver
   * @param {*} actionType - circuit action type that you are registering the verification key for
   * @param {object} transactionOverrides - ethers transaction overrides object to be applied to the transaction
   * @returns ethers.TransactionReceipt object
   */
  async registerVerificationKey(vk, actionType, transactionOverrides) {
    assert(typeof vk !== 'undefined', 'No verification key supplied');
    assert(typeof actionType !== 'undefined', 'No actionType supplied');

    if (typeof transactionOverrides === 'undefined') {
      transactionOverrides = {};
    }

    const tx = await this.shieldContract.registerVerificationKey(
      vk,
      actionType,
      transactionOverrides,
    );

    return tx.wait();
  }
}

module.exports = BaselineWorkgroupManager;
