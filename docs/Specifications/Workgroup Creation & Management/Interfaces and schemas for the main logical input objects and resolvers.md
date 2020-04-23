# Workgroup creation and management - interfaces and schemas for the main logical input objects and resolvers

# Overview

The goal of this specification is to outline the current state of the main logical input objects that are needed for the creation and management of a baseline workgroup. It also defines the ways these inputs are to be resolved and highlights the extensibility of the resolving approach.

The current version of this document is hugely influenced by the Radish34 demo use-case and we expect it to be gradually becoming more generic with the addition of new use-cases and abstracting Radish34 into Baseline.

## Logical Inputs

The logical inputs in a workgroup creation and management are input parameters that have to be provided from the workgroup management body in order for certain actions to be taken. The concrete inputs required by the various actions are yet to be defined in another specification. This document will highlight all the main logical inputs - Keystore, organisation config, zero-knowledge circuit verifier key, and contract artefacts.

## Resolvers

The resolvers are objects/classes designed to allow for these logical objects to be input in different formats and through different mediums and be transformed(resolved) into a format(schema) that the baseline tools will be able to work with.

The resolvers are a point of extensibility allowing for additional community-created resolvers to be developed as long as they adhere to the specific logical input resolver interface.

# Keystore

## Keystore as logical input

The keystores are containers of signing keys. These keys provide certain abilities for the workgroup administrator. Most commonly these are needed for signing transactions - deploying contracts, performing administrative transactions & more. 

## Keystore resolver interface

The keystore resolver defines an abstract interface to be implemented. This interface governs how keystores are to be input in the baseline tooling and what the expected outputs are.

Any keystore resolver should be a class that adheres to the following interface:

    interface KeystoreResolver {
    	resolve(extraParams) : Promise<ethers.Signer>
    }

Invocation of the `resolve` method of the resolver should return a promise returning an object adhering to the `ethers.Signer` ([https://github.com/ethers-io/ethers.js/blob/master/src.ts/abstract-signer.ts#L12](https://github.com/ethers-io/ethers.js/blob/master/src.ts/abstract-signer.ts#L12)). In the future, we might decide to change to even more generic signer or web3 instance.

The `extraParams` are additional resolver-specific customization params passed as an input that might be needed for the resolver to work. The idea behind `extraParams` is to allow for further customizations of the resolver behavior. An example of extra params might be headers objects for a REST API based resolver.

## Inbuilt Baseline Keystore resolvers

### KeystorePathResolver

An inbuilt `KeystorePathResolver` is to be developed. This resolver would adhere to the `KeystoreResolver` interface.

    class KeystorePathResolver {
    	constructor(keystorePath) { ... }
    	resolve(extraParams) { ... }
    }

The `keystorePath` param is resolver specific parameter to allow the resolver to find and resolve the input data to the resulting object. It needs to be a system path to a file. Currently, this file needs to adhere to the following schema:

    {
    	signingKey: {
    		address: string,
    		mnemonic: string,
    		privateKey: string
    	}
    }

The resolver parses this object and creates `ethers.Signer` object out of it.

The `extraParams` param is unused for this resolver.

## Example of a custom resolvers

An example of a custom `KeystoreResolver` that the community might find valuable is a Keystore  backed by a cloud HSM. HSM protected keys are the highest state of security, something that the highest standards companies would want/need to adhere to in order to ensure maximum security of their systems. As long as this resolver returns an object adhering to the `ethers.Signer` interface, the baseline tooling will work correctly. In the meantime, the `sendTransaction` and `signMessage` methods of the resulting objects can be leveraging the HSM infrastructure.

# Contract Artifacts

## Contract artifacts as logical input

The contract artifacts are an object containing the necessary data to deploy or interact with a certain contract. In order to be used by the baseline tooling, the resolved contract object needs to follow the following schema:

`ContractArtifactsSchema` :

    // ContractArtifactsSchema
    {
    	contractName: string,
    	abi: array, // Contract ABI
    	bytecode: string, // Contract bytecode
    }

### Note on contracts with linked libraries

Depending on the compiler and framework used to compile the contracts' source code to bytecode, solidity contracts using libraries are output in different ways. Truffle and Etherlime use a specific modification of this bytecode in order to allow easy library linking. Current baseline tooling is to adhere to this "somewhat of a standard".

"*Replacing the __hash(path.name)__ with __libraryname__ become "somewhat of a standard" as it allows for linking to happen on a different machines than the compilation machine."*

More info:

[https://github.com/trufflesuite/truffle/blob/99add8f5e47586030a44a999bcfb287224e304e1/packages/contract/lib/utils/index.js#L146](https://github.com/trufflesuite/truffle/blob/99add8f5e47586030a44a999bcfb287224e304e1/packages/contract/lib/utils/index.js#L146)

[https://github.com/LimeChain/etherlime/blob/446b411961c50c36797727fea725d1bdc5a962c5/packages/etherlime-utils/utils/linking-utils.js#L5](https://github.com/LimeChain/etherlime/blob/446b411961c50c36797727fea725d1bdc5a962c5/packages/etherlime-utils/utils/linking-utils.js#L5)

## Contract artifacts resolver interface

The contract artefacts resolver defines an abstract interface to be implemented. This interface governs how contracts are to be input in the baseline tooling and what the expected outputs are.

Any contract artefacts resolver should be a class that adheres to the following interface:

    interface ContractArtifactsResolver {
    	resolve(contractName, extraParams) : Promise<ContractArtifactsSchema>
    }

Invocation of the `resolve` method of the resolver should return a promise returning an object adhering to `ContractArtifactsSchema` outlined in the previous section.

The `contractName` param is a param allowing for the tooling to specify for which contracts it needs the artifacts to be resolved. For example, the baseline deployment tools might request the resolving of the `OrgRegistry` contract artifacts - the result of the compilation of the `OrgRegistry.sol` contract.

The `extraParams` are additional resolver-specific customization params passed as an input that might be needed for the resolver to work. The idea behind `extraParams` is to allow for further customizations of the resolver behavior. An example of extra params might be authentication parameters for an FTP access to a directory containing the contract artifacts.

## Inbuilt Baseline contract artifacts resolvers

### ContractArtifactsPathResolver

`ContractArtifactsPathResolver` is to be developed. This resolver would adhere to the `ContractArtifactsResolver` interface.

    class ContractArtifactsPathResolver {
    	constructor(path) { ... }
    	resolve(contractName, extraParams) { ... }
    }

The `path` param is resolver specific parameter to allow the resolver to find and resolve the input data to the resulting object. The `path` param of this resolver needs to be a file system path to a directory. The `contractName` would be the name of a contract to be resolved. The resolver will look for a file named `contractName` with the extension of `.json` (as this is the common output of the compilers) in the `path` directory. Upon finding this file it will parse the object and return it to the tooling. 

The `extraParams` param is unused for this resolver.

## Example of a custom resolvers

An example of custom `ContractArtifactsResolver` is to be developed as `Radish34ContractArtifactsPathResolver`. As Radish34 uses "0x" compiler that has a different output than Truffle and Etherlime, further modification needs to be made to the resulting bytecode in order for it to adhere to the  `ContractArtifactsSchema`. 

# Verifier Key

## Verifier key as logical input

The verifier keys are one of the resulting artifacts of the zero-knowledge proofs setups. These are keys needed to verify a proof provided by a certain party for the successful execution of a workflow defined by a certain circuit. These verifier keys have to be stored in the workgroup contracts in order for the workgroup to function properly.

`VerifierKeySchema` :

    // VerifierKeySchema
    {
    	verifierKey: array // flattened verification key int array
    }

## Verifier key resolver interface

The verifier key resolver defines an abstract interface to be implemented. This interface governs how verifier keys are to be inputed in the baseline tooling and what the expected outputs are.

Any contract artifacts resolver should be a class that adheres to the following interface:

    interface VerifierKeyResolver {
    	resolve(circuitName, extraParams) : Promise<VerifierKeySchema>
    }

Invocation of the `resolve` method of the verifier key resolver should return a promise returning an object adhering to `VerifierKeySchema` outlined in the previous section.

The `circuitName` param is a param allowing for the tooling to specify which circuit verifier key it needs resolved. For example, when deploying workgroup for Radish34, the baseline deployment tools will request the resolving of the `createPO` circuit verifier key.

The `extraParams` are additional resolver-specific customization params passed as an input that might be needed for the resolver to work. The idea behind `extraParams` is to allow for further customizations of the resolver behavior. 

## Inbuilt Baseline verifier key resolvers

### VerifierKeyPathResolver

`VerifierKeyPathResolver` is to be developed. This resolver would adhere to the `VerifierKeyResolver` interface.

    class VerifierKeyPathResolver {
    	constructor(path) { ... }
    	resolve(circuitName, extraParams) { ... }
    }

The `path` param is resolver specific parameter to allow the resolver to find and resolve the input data to the resulting object. The `path` param of this resolver needs to be a file system path to a directory. The `circuitName` would be the name of a circuit whose verifier key to be resolved. The resolver will look for a file named `circuitName` with the extension of `.json` in the `path` directory. Upon finding this file it will parse the object and return it to the tooling. 

The `extraParams` param is unused for this resolver.

## Example of a custom resolvers

An example of custom `VerifierKeyResolver` is to be developed as `Radish34VerifierKeyRestResolver`. As Radish34 uses `zkp` REST service in order to fetch the verifier keys this custom resolver needs to be developed to facilitate the retrieval of the data and modifying the response to adhere to the `VerifierKeySchema`

    class Radish34VerifierKeyRestResolver {
    	constructor(zkpRestUrl) { ... }
    	resolve(circuitName, extraParams) { ... }
    }

# Organisation Config

## Organisation config as logical input

The organisation config is a logical input object containing information about an organisation. This input will be used during the registration of an organisation for a workgroup. The information inside this config allows the other workgroup members to recognize this organisation and work out the method of communication with this organisation.

The organisation config has to adhere to the following schema.

`OrganisationConfigSchema` :

    // OrganisationConfigSchema
    {
    	name: string, // the human readable name of the organisation
    	role: int, // the role of this organisation in the context of this workgroup
    	address: string, // the mainnet address of this organisation
    	zkPublicKey: string, // hex zero knowledge public key for zokrates proof verification
    	messagingKey: string // the key for secret communication with this organisation
    }

## Organisation config resolver interface

The organisation config resolver defines an abstract interface to be implemented. This interface governs how organisation configs are to be input in the baseline tooling and what the expected outputs are.

Any organisation config resolver should be a class that adheres to the following interface:

    interface OrganisationConfigResolver {
    	resolve(extraParams) : Promise<OrganisationConfigSchema>
    }

The invocation of the `resolve` method should return a promise returning an object adhering to `OrganisationConfigSchema` outlined in the previous section.

The `extraParams` are additional resolver-specific customization params passed as an input that might be needed for the resolver to work. The idea behind `extraParams` is to allow for further customizations of the resolver behavior. 

## Inbuilt Baseline organisaction config resolvers

### OrganisationConfigPathResolver

`OrganisationConfigPathResolver` is to be developed. This resolver would adhere to the `OrganisationConfigResolver` interface.

    class OrganisationConfigPathResolver {
    	constructor(configPath) { ... }
    	resolve(extraParams) { ... }
    }

The `configPath` param is resolver specific parameter to allow the resolver to find and resolve the input data to the resulting object. The `configPath` param of this resolver needs to be a path to a file on the file system adhering to the `OrganisationConfigSchema`.  Upon invoking the `resolve` method the resolver will try to parse the file at `configPath` and return the resulting organisation config object to the invoker.

The `extraParams` param is unused for this resolver.

## Example of a custom resolvers

An example of a custom `OrganisationConfigResolver` would be a resolver that gets the organsation config object via REST API from a remote server instead of a path on the file system.