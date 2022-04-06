# Packages

One or more "core" baseline protocol packages are needed to baseline-enable applications and systems of record.

### Modules & Packages

| Package                       | Source Path     | Description                                                                                                                                   |
| ----------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `@baseline-protocol/api`      | `core/api`      | Core _baseline_ API package providing unified access to the `baseline` JSON-RPC module and blockchain, registry and key management interfaces |
| `@baseline-protocol/baseline` | `core/baseline` | Core _baseline_ package provides unified access to internal integration middleware interfaces for systems of record                           |
| `@baseline-protocol/ccsm`     | `core/ccsm`     | Core _ccsm_ package provides interfaces for general interaction with an underlying mainnet                                                    |
| `@baseline-protocol/identity` | `core/identity` | Core _identity_ package provides interfaces for organization registry and decentralized identifiers (_DIDs_)                                  |
| `@baseline-protocol/privacy`  | `core/privacy`  | Core _privacy_ package provides interfaces supporting `Prover`systems and and zero-knowledge cryptography                                     |
| `@baseline-protocol/types`    | `core/types`    | Core reusable type definitions                                                                                                                |
| `@baseline-protocol/vaults`   | `core/vaults`   | Core _vault_ Provides management interfaces for digital authentication credentials such as keys and secrets                                   |
