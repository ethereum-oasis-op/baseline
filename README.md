<div align="center">
  <img alt="Baseline" src="docs/assets/baseline-logo/Web/examples/PNGs/horizontal/baselineHorizontal-Logo-FullColor.png" />
  <p>
    Combining advances in cryptography, messaging, and blockchain to execute
    <br/>
    secure and private business processes via the public Ethereum Mainnet.
  </p>
  Read the full documentation <a href="https://docs.baseline-protocol.org">here at docs.baseline-protocol.org</a>.
  <p>
    <em>Join our <a href="https://communityinviter.com/apps/ethereum-baseline/join-us">Slack workspace</a> for Baseline news and updates!</em>
  </p>
  <br/>
</div>

# Baseline Protocol

<img src="https://img.shields.io/badge/baseline-mail%40list-blue" href="https://lists.oasis-open-projects.org/g/baseline">
<img src="https://img.shields.io/badge/baseline-protocol-blueviolet" href="https://docs.baseline-protocol.org/">

- [Baseline Protocol](#baseline-protocol)
  - [Architecture](#architecture)
  - [Modules & Packages](#modules---packages)
  - [License](#license)
  - [Contributing](#contributing)

## Architecture

![baseline-protocol-architecture](https://user-images.githubusercontent.com/161261/86484557-79504f00-bd24-11ea-8edb-d665cb55db20.png)

## Modules & Packages

The following "core" modules comprise the initial release of the Baseline
protocol:

| Package                          | Source Path        | Description                                                                                                                                   |
| -------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `@baseline-protocol/api`         | `core/api`         | Core _baseline_ API package providing unified access to the `baseline` JSON-RPC module and blockchain, registry and key management interfaces |
| `@baseline-protocol/contracts`   | `core/contracts`   | Solidity contracts packaged as a Truffle project; includes ERC1820/organization registry                                                      |
| `@baseline-protocol/messaging`   | `core/messaging`   | Core messaging package with protocol-agnostic p2p interface with NATS and Whisper implementations                                             |
| `@baseline-protocol/persistence` | `core/persistence` | Persistence package; this is a placeholder for system of record integration standards (see ERP connector projects under `examples/`)          |
| `@baseline-protocol/privacy`     | `core/privacy`     | Core privacy package initially exposing a zkSnark circuit provider factory; designed to support future privacy implementations                |
| `@baseline-protocol/types`       | `core/types`       | Core reuseable type definitions; also provides a convenience wrapper around interacting with `lib/` assets (i.e. circuits)                    |

Implementing a minimum set of these `core` packages will help you maintain
_baseline-compliance_ as the protocol evolves and standards emerge. As of the
initial `core` release, depending on the `api`, `messaging` and `privacy`
packages should be considered the most minimalistic approach to implementing the
protocol, provided that your organization is participating in a workgroup that
has deployed the `contracts` artifacts. A reference implementation and
end-to-end test suite featuring Alice and Bob is being maintained under
[`examples/baseline-app`](examples/baseline-app).

## License

All code in this repo is released under the CC0 1.0 Universal public domain
dedication. For the full license text, refer to [license.md](license.md).

## Contributing

See [our contributing guidelines](CONTRIBUTING.md)
