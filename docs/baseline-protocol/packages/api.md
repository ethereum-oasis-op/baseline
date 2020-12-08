# API

## @baseline-protocol/api

Baseline core API package.

### Installation

`npm install @baseline-protocol/api`

### Building

You can build the package locally with `npm run build`.

### Testing

Run the local test suite with `npm test`.

### Baseline JSON-RPC Module

An initial set of JSON-RPC methods have been defined for inclusion in the specification. These methods allow easy interaction with on-chain shield contracts (which contain merkle-tree fragments) and maintain full merkle-trees (along with metadata) in local off-chain storage.

| Method | Params | Description |
| -------- | ----- | ----------- |
| `baseline_getCommit` | address, commitIndex | Retrieve a single commit from a tree at the given shield contract address |
| `baseline_getCommits` | address, startIndex, count | Retrieve multiple commits from a tree at the given shield contract address |
| `baseline_getRoot` | address | Retrieve the root of a tree at the given shield contract address |
| `baseline_getProof` | address, commitIndex | Retrieve the membership proof for the given commit index |
| `baseline_getTracked` | | Retrieve a list of the shield contract addresses being tracked and persisted |
| `baseline_verifyAndPush` | sender, address, proof, publicInputs, commit | Inserts a single commit in a tree for a given shield contract address |
| `baseline_track` | address | Initialize a merkle tree database for the given shield contract address |
| `baseline_untrack` | address | Remove event listeners for a given shield contract address |
| `baseline_verify` | address, value, siblings | Verify a proof for a given root and commit value |


#### Ethereum clients that support baseline JSON-RPC

* [Nethermind](https://github.com/NethermindEth/nethermind) .NET client
* Any client supported by the [commit-mgr](https://github.com/ethereum-oasis/baseline/tree/master/examples/bri-2/commit-mgr) service. These include:
  * [ganache](https://github.com/trufflesuite/ganache)
  * [besu](https://github.com/hyperledger/besu)
  * [Infura](https://infura.io/docs/ethereum)
  * [Infura Transactions (ITX)](https://infura.io/docs/transactions)

### Interfaces

**IBaselineRPC**

```text
getCommit(address: string, index: number): Promise<MerkleTreeNode>;
getCommits(address: string, startIndex: number, count: number): Promise<MerkleTreeNode[]>;
getRoot(address: string): Promise<string>;
getProof(address: string, commitIndex: number): Promise<MerkleTreeNode[]>;
getTracked(): Promise<string[]>;
verifyAndPush(sender: string, address: string, proof: number[], publicInputs: string[], commit: string): Promise<string>;
track(address: string): Promise<boolean>;
untrack(address: string): Promise<boolean>;
verify(address: string, root: string, commit: string, siblingPath: MerkleTreeNode[]): Promise<boolean>;;
```

**IRegistry**

```text
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

**IVault**

```text
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

### Supported Providers & Protocols

The following providers of the Baseline API are available:

* Ethers.js - _example provider; not yet implemented but included here for illustrative purposes_
* [Provide](https://provide.services) - [BRI-1](../../bri/bri-1/) reference implementation \(see `examples/bri-1/base-example`\)
* RPC - generic JSON-RPC provider

