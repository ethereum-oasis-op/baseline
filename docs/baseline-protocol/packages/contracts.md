# Contracts

## @baseline-protocol/contracts

Baseline core contracts package.

### Installation

`npm install @baseline-protocol/contracts`

### Building

You can build the package locally with `make`. The build compiles the Baseline solidity contracts package and its dependencies using truffle.

### Shield

The contracts package includes a generic "shield" contract which enforces on-chain verification of commitments before they are added to the on-chain merkle-tree. The logic encoded into the on-chain "verifier" contract can be custom code or a workgroup can choose to use a generic verifier (i.e. verifier may only require that a commitment is signed by each workgroup member). For convenience, a "VerifierNoop" contract is provided in the contracts package for testing a baseline workflow. The "no-op" verifier will return `true` for any set of arguments with the proper types.

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
