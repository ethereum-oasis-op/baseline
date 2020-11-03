# Contracts

## @baseline-protocol/contracts

Baseline core contracts package.

### Installation

`npm install @baseline-protocol/contracts`

### Building

You can build the package locally with `make`. The build compiles the Baseline solidity contracts package and its dependencies using truffle.

### Organization Registry

Each organization registered within the `OrgRegistry` first generates a `secp256k1` keypair and uses the Ethereum public address representation as "primary key" for future resolution. This key SHOULD NOT sign transactions. A best practice is to use an HD wallet to rotate keys, preventing any account from signing more than a single transaction.

Note that an organization may not update its `address`.

```text
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

### Shield

Unlike the [Radish34](../../bri/radish34/) Reference Implementation, the contracts package does not include a "shield" contract. Rather, it is up to each workgroup to determine a suitable _shielding_ mechanism to ensure privacy. For example, the `IBaselineRPC` implementation within the Nethermind client used in the [BRI-1](../../bri/bri-1/) Reference Implementation ships with [shield contract binaries](https://github.com/NethermindEth/nethermind/tree/master/src/Nethermind/Nethermind.Baseline/contracts) \(i.e., including the MerkleTreeSHA contract\).

