# Privacy

## @baseline-protocol/privacy

Baseline core privacy package.

### Installation

`npm install @baseline-protocol/privacy`

### Building

You can build the package locally with `npm run build`.

### Interfaces

**IZKSnarkCircuitProvider**

```text
compile(source: string, location: string): Promise<any>;
computeWitness(artifacts: any, args: any[]): Promise<any>;
exportVerifier(verifyingKey): Promise<string>;
generateProof(circuit, witness, provingKey): Promise<string>;
setup(circuit): Promise<any>;
```

### Supported Frontends

The following zkSNARK toolboxes are supported:

* ZoKrates

### Architecture

![](../../.gitbook/assets/baseline-zok-flow-2.png)

