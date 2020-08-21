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

![baseline-zok-flow](https://user-images.githubusercontent.com/35908605/86961126-b35b8f80-c12e-11ea-9902-7367bb75dd34.png)
