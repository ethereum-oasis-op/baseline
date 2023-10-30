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

![baseline-zok-flow-3](https://user-images.githubusercontent.com/2992995/103652526-86642a00-4f63-11eb-8102-56cd9b6e86d4.png)
