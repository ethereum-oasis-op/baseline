# @baseline-protocol/privacy

Baseline core privacy package.

## Installation

`npm install @baseline-protocol/privacy`

## Building

You can build the package locally with `npm run build`.

## Interfaces

__IZKSnarkCircuitProvider__

```
compile(source: string, location: string): Promise<any>;
computeWitness(artifacts: any, args: any[]): Promise<any>;
exportVerifier(verifyingKey): Promise<string>;
generateProof(circuit, witness, provingKey): Promise<string>;
setup(circuit): Promise<any>;
```

## Supported Frontends

The following zkSNARK toolboxes are supported:

- ZoKrates

## Architecture/Flow

!![baseline-zok-flow-2](https://user-images.githubusercontent.com/35908605/91189371-61f86700-e6c0-11ea-86f4-e6b3690bcd8e.png)
