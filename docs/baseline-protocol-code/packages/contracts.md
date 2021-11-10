# CCSM

## @baseline-protocol/ccsm

The Baseline core CCSM package provides interfaces for general interaction with an underlying mainnet or layer-2 distributed solution.&#x20;

### Installation

`npm install @baseline-protocol/ccsm`_(npm package soon to be published)_

### Building

You can build the package locally with `make`. The build compiles the Baseline solidity contracts package and its dependencies using truffle.

### Shield

The contracts package includes a generic "shield" contract which enforces on-chain verification of commitments before they are added to the on-chain merkle-tree. The logic encoded into the on-chain "verifier" contract can be custom code or a workgroup can choose to use a generic verifier (i.e. verifier may only require that a commitment is signed by each workgroup member). For convenience, a "VerifierNoop" contract is provided in the contracts package for testing a baseline workflow. The "no-op" verifier will return `true` for any set of arguments with the proper types.

