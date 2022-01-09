# Baseline Protocol

![baseline-protocol-architecture](https://user-images.githubusercontent.com/161261/86484557-79504f00-bd24-11ea-8edb-d665cb55db20.png)

One or more "core" baseline protocol packages are needed to baseline-enable applications and systems of record.

## Modules & Packages

| Package | Source Path | Description |
| -------- | ----- | ----------- |
| `@baseline-protocol/api` | `core/api` | Core *baseline* API package providing unified access to the `baseline` JSON-RPC module and blockchain, registry and key management interfaces |
| `@baseline-protocol/contracts` | `core/contracts` | Solidity contracts packaged as a Truffle project; includes ERC1820/organization registry |
| `@baseline-protocol/messaging` | `core/messaging` | Core messaging package with protocol-agnostic p2p interface with NATS and Whisper implementations |
| `@baseline-protocol/persistence` | `core/persistence` | Persistence package; this is a placeholder for system of record integration standards (see ERP connector projects under `examples/bri-1/lib`) |
| `@baseline-protocol/privacy` | `core/privacy` | Core privacy package initially exposing a zkSnark circuit provider factory; designed to support future privacy implementations |
| `@baseline-protocol/types` | `core/types` | Core reuseable type definitions; also provides protocol message marshaling/unmarshaling utilities |
