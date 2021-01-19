# @baseline-protocol/api

Baseline core API package.

## Installation

`npm install @baseline-protocol/api`

## Building

You can build the package locally with `npm run build`.

## Baseline JSON-RPC Module

An initial set of JSON-RPC methods have been defined for inclusion in the specification. These methods allow easy interaction with on-chain shield contracts (which contain merkle-tree fragments) and maintain full merkle-trees (along with metadata) in local off-chain storage.

| Method | Params | Description |
| -------- | ----- | ----------- |
| `baseline_getCommit` | address, commitIndex | Retrieve a single commit from a tree at the given shield contract address |
| `baseline_getCommits` | address, startIndex, count | Retrieve multiple commits from a tree at the given shield contract address |
| `baseline_getRoot` | address | Retrieve the root of a tree at the given shield contract address |
| `baseline_getSiblings` | address, commitIndex | Retrieve sibling paths (proof) of the given commit index |
| `baseline_getTracked` | | Retrieve a list of the shield contract addresses being tracked and persisted |
| `baseline_verifyAndPush` | sender, address, proof, publicInputs, commit | Inserts a single commit in a tree for a given shield contract address |
| `baseline_track` | address | Initialize a merkle tree database for the given shield contract address |
| `baseline_untrack` | address | Remove event listeners for a given shield contract address |
| `baseline_verify` | address, value, siblings | Verify a sibling path for a given root and commit value |

### Ethereum Clients

- [Nethermind](https://github.com/NethermindEth/nethermind) .NET client

## Interfaces

__IBaselineRPC__

This interface provides methods to deploy Shield contracts on the blockchain, and execute read/write operations on them. Writes are necessary when adding new hashes (commitments) to the on-chain merkle tree. Reads are necessary to verify consistency of off-chain records with on-chain state.

```javascript
getCommit(address: string, index: number): Promise<MerkleTreeNode>;
getCommits(address: string, startIndex: number, count: number): Promise<MerkleTreeNode[]>;
getRoot(address: string): Promise<string>;
getSiblings(address: string, commitIndex: number): Promise<MerkleTreeNode[]>;
getTracked(): Promise<string[]>;
verifyAndPush(sender: string, address: string, proof: number[], publicInputs: string[], commit: string): Promise<string>;
track(address: string): Promise<boolean>;
untrack(address: string): Promise<boolean>;
verify(address: string, root: string, commit: string, siblingPath: MerkleTreeNode[]): Promise<boolean>;
```

![IBaselineRPC](https://user-images.githubusercontent.com/35908605/93899621-7d0bc600-fcc2-11ea-9dae-46497acf204a.png)

__IRegistry__

This interface provides methods to establish an on-chain OrgRegistry, which is used to identify the parties involved in a particular workgroup.

```javascript
// workgroups
createWorkgroup(params: object): Promise<any>;
updateWorkgroup(workgroupId: string, params: object): Promise<any>;
fetchWorkgroups(params: object): Promise<any>;
fetchWorkgroupDetails(workgroupId: string): Promise<any>;
fetchWorkgroupOrganizations(workgroupId: string, params: object): Promise<any>;
createWorkgroupOrganization(workgroupId: string, params: object): Promise<any>;
updateWorkgroupOrganization(workgroupId: string, organizationId: string, params: object): Promise<any>;
fetchWorkgroupInvitations(workgroupId: string, params: object): Promise<any>;
fetchWorkgroupUsers(workgroupId: string, params: object): Promise<any>;
createWorkgroupUser(workgroupId: string, params: object): Promise<any>;
updateWorkgroupUser(workgroupId: string, userId: string, params: object): Promise<any>;
deleteWorkgroupUser(workgroupId: string, userId: string): Promise<any>;

// organizations
createOrganization(params: object): Promise<any>;
fetchOrganizations(params: object): Promise<any>;
fetchOrganizationDetails(organizationId: string): Promise<any>;
updateOrganization(organizationId: string, params: object): Promise<any>;

// organization users
fetchOrganizationInvitations(organizationId: string, params: object): Promise<any>;
fetchOrganizationUsers(organizationId: string, params: object): Promise<any>;
inviteOrganizationUser(organizationId: string, params: object): Promise<any>;
```

__IVault__

This interface provides methods to securely sign and encrypt/decrypt data. Private/public key pairs are stored in a Vault service, then requests are sent to the service to use those keys. This is more secure because it limits the attack vector compared to alternatives such as allowing signing keys to reside within a blockchain client.

```javascript
createVault(params: object): Promise<any>;
fetchVaults(params: object): Promise<any>;
fetchVaultKeys(vaultId: string, params: object): Promise<any>;
createVaultKey(vaultId: string, params: object): Promise<any>;
deleteVaultKey(vaultId: string, keyId: string): Promise<any>;
encrypt(vaultId: string, keyId: string, payload: string): Promise<any>;
decrypt(vaultId: string, keyId: string, payload: string): Promise<any>;
signMessage(vaultId: string, keyId: string, msg: string): Promise<any>;
verifySignature(vaultId: string, keyId: string, msg: string, sig: string): Promise<any>;
fetchVaultSecrets(vaultId: string, params: object): Promise<any>;
createVaultSecret(vaultId: string, params: object): Promise<any>;
deleteVaultSecret(vaultId: string, secretId: string): Promise<any>;
```

## Supported Providers & Protocols

The following providers of the Baseline API are available:

- Ethers.js - *example provider; not yet implemented*
- [Provide](https://provide.services) - enterprise-grade reference implementation (see [examples/bri-1/base-example](https://github.com/ethereum-oasis/baseline/tree/master/examples/bri-1/base-example))
- RPC - generic JSON-RPC provider
