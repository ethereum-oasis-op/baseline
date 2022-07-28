# Identity

## @baseline-protocol/identity

Baseline core identity package.

### Installation

`npm install @baseline-protocol/identity`_(npm package soon to be published)_

### Building

You can build the package locally with `npm run build`.

### Organization Registry

Each organization registered within the `OrgRegistry` first generates a `secp256k1` keypair and uses the Ethereum public address representation as "primary key" for future resolution. This key SHOULD NOT sign transactions. A best practice is to use an HD wallet to rotate keys, preventing any account from signing more than a single transaction.

Note that an organization may not update its `address`.

```
struct Org {
    address orgAddress;
    bytes32 name;
    bytes messagingEndpoint;
    bytes whisperKey;
    bytes zkpPublicKey;
    bytes metadata;
}

struct OrgInterfaces {
    bytes32 groupName;
    address tokenAddress;
    address shieldAddress;
    address verifierAddress;
}

mapping (address => Org) orgMap;
mapping (uint => OrgInterfaces) orgInterfaceMap;
uint orgInterfaceCount;

Org[] public orgs;
mapping(address => address) managerMap;

event RegisterOrg(
    bytes32 _name,
    address _address,
    bytes _messagingEndpoint,
    bytes _whisperKey,
    bytes _zkpPublicKey,
    bytes _metadata
);

event UpdateOrg(
    bytes32 _name,
    address _address,
    bytes _messagingEndpoint,
    bytes _whisperKey,
    bytes _zkpPublicKey,
    bytes _metadata
);
```
