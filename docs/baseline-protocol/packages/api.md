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

An initial set of JSON-RPC methods have been defined for inclusion in the specification:

| Method | Description |
| :--- | :--- |
| `baseline_deploy` | Deploy a shield contract given the compiled artifact bytecode and ABI |
| `baseline_getLeaf` | Retrieve a single leaf from a tree at the given shield contract address |
| `baseline_getLeaves` | Retrieve multiple leaves from a tree at the given shield contract address |
| `baseline_getRoot` | Retrieve the root of a tree at the given shield contract address |
| `baseline_getSiblings` | Retrieve sibling paths/proof of the given leaf index |
| `baseline_getTracked` | Retrieve a list of the shield contract addresses being tracked and persisted |
| `baseline_insertLeaf` | Inserts a single leaf in a tree at the given shield contract address |
| `baseline_insertLeaves` | Inserts multiple leaves in a tree at the given shield contract address |
| `baseline_track` | Initialize a merkle tree database for the given shield contract address |
| `baseline_verify` | Verify a sibling path for a root and leaf at the given shield contract address |

#### Ethereum clients that support baseline JSON-RPC

* [Nethermind](https://github.com/NethermindEth/nethermind) .NET client

### Interfaces

**IBaselineRPC**

```text
deploy(sender: string, bytecode: string, abi: any): Promise<any>;
getLeaf(address: string, index: number): Promise<MerkleTreeNode>;
getLeaves(address: string, indexes: number[]): Promise<MerkleTreeNode[]>;
getRoot(address: string): Promise<string>;
getSiblings(address: string, leafIndex: number): Promise<MerkleTreeNode[]>;
getTracked(): Promise<string[]>;
insertLeaf(sender: string, address: string, value: string): Promise<MerkleTreeNode>;
insertLeaves(sender: string, address: string, value: string): Promise<MerkleTreeNode>;
track(address: string): Promise<boolean>;
verify(address: string, root: string, leaf: string, siblingPath: MerkleTreeNode[]): Promise<boolean>;
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

