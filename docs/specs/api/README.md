# Baseline Protocol Specifications

![Baseline Logo](https://raw.githubusercontent.com/ethereum-oasis/baseline/master/docs/assets/baseline-logo/Web/examples/PNGs/horizontal/baselineHorizontal-Logo-FullColor.png)

*Read the full documentation [here at docs.baseline-protocol.org](https://docs.baseline-protocol.org/).*
*Join our [Slack workspace](https://communityinviter.com/apps/ethereum-baseline/join-us), [Discord channel](https://discord.com/invite/NE8AYD7), [Telegram channel](https://t.me/baselineprotocol) and follow us on [Twitter](https://twitter.com/baselineproto) for Baseline news and updates!* 

## The Baseline API & Data Model Specification

The document describes the Baseline programming interface and expected behaviors of all instances of this interface together with the required programming interface data model.

## Status

The Baseline API & Data Model Specification is currently work in progress.

## Components

<table>
<tr>
    <th>Component</th>
    <th>Component Description</th>
  </tr>
  <tr>
    <td>IBaselineRPC</td>
    <td>Describes interface that provide functions to interact with Agreement Execution Layer.</td>
  </tr>
  <tr>
    <td>IRegistry</td>
    <td>Describes interface that provide functions to manage workgroups, organizations and users.</td>
  </tr>
  <tr>
    <td>IVault</td>
    <td>Describes interface that provide functions to manage vaults and keys.</td>
  </tr>
  <tr>
    <td>IBlockchainService</td>
    <td>Describes interface that provide functions for Blockchain clients.</td>
  </tr>
  <tr>
    <td>Data Model</td>
    <td>Describes all required data structures and elements at each functional layer such as API data models or account structures.</td>
  </tr>
</table>

## License

All contribution in this repo is released under the CC0 1.0 Universal public domain dedication. For the full license text, refer to [LICENSE](https://github.com/ethereum-oasis/baseline/blob/master/LICENSE).

## Contributions

To participate in the evolution of Baseline via the specs process, please see our [Contributors Guidelines](https://docs.baseline-protocol.org/community/contributors).