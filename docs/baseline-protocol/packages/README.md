# Packages

One or more "core" baseline protocol packages are needed to baseline-enable applications and systems of record.

### Modules & Packages

| Package | Source Path | Description |
| :--- | :--- | :--- |
| `@baseline-protocol/api` | `core/api` | Core _baseline_ API package providing unified access to the `baseline` JSON-RPC module and blockchain, registry and key management interfaces |
| `@baseline-protocol/contracts` | `core/contracts` | Solidity contracts packaged as a Truffle project; includes ERC1820/organization registry |
| `@baseline-protocol/messaging` | `core/messaging` | Core messaging package with protocol-agnostic p2p interface with NATS and Whisper implementations |
| `@baseline-protocol/persistence` | `core/persistence` | Persistence package; this is a placeholder for system of record integration standards \(see ERP connector projects under `examples/`\) |
| `@baseline-protocol/privacy` | `core/privacy` | Core privacy package initially exposing a znSNARK circuit provider factory; designed to support future privacy implementations |
| `@baseline-protocol/types` | `core/types` | Core reusable type definitions |

