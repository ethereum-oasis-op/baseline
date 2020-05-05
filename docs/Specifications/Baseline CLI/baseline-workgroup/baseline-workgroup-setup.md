# baseline workgroup setup

# Overview

`baseline workgroup setup` is the first of the `baseline workgroup` family of commands. The goal of this command is to allow you to create the necessary configuration files needed for the successful execution of the other `baseline workgroup` commands.

In the initial version this command can be used with one of 4 modifiers:

- `:keystore` - used for creation of the `keystore-config.json` file needed to resolve the interactor blockchain keystore.
- `:workgroup` - used for creation of the `workgroup-config.json` file needed to resolve and configure the creation of a workgroup
- `:organisation` - used for creaton of `${organisationName}-organisation-config.json` file used for resolving organisation details when registering organisation
- `:workflow`- used for creaton of `${workflowName}-config.json` file used for resolving workflow details when registering workflows

# Commands

## CLI interactivity

Every CLI command will have both interactive and non-interactive version triggered by the `-i` flag. The non-interactive version of the command will output a template of the resulting artifacts ready for the administrator to fill in.

The interactive versions of the command will walk the administrator through filling in the details needed in the configuration file.

## baseline workgroup setup:keystore

The purpose of this command is to output `keystore-config.json`. The purpose of the resulting artifact is to be supplied as an argument to some of the other `baseline workgroup` commands.

It is highly recommended for this file to always be specified in the  `.gitignore` file or sensitive data can be leaked.

### Format of the resulting artifact

```json
{
	"keystore": {
		"resolver": {
			"type": string,
			"value": string,
			"extra": string
		}
	}
}
```

The main purpose of this artifact is to specify the resolver for the keystore. The `type` property of this resolver config will have several predifined values. In the first version these will be `path` - resolving to the `KeystorePathResolver` and `custom` for custom resolvers.

Usage of each of those would be specified in the documentation and as an example at the top of the file.

More info about keystore resolvers can be found in the "Interfaces and schemas for the main logical input objects and resolvers" specification.

## baseline workgroup setup:workgroup

The purpose of this command is to output `workgroup-config.json`. The purpose of the resulting artifact is to be supplied as an argument to the deployment command of the `baseline` CLI.

### Format of the resulting artifact

```json
{
	"contracts": {
		"resolver": {
			"type": string,
			"value": string,
			"extra": string
		}
	}
}
```

The main purpose of this artifact is to specify the resolver for the workgroup configuration. In the initial version of it would only need to specify the resolver for the contract artifacts, but can be extended with further configurations with the progress of baseline.

The `type` property of this resolver config will have several predefined values. In the first version these will be `path` - resolving to the `ContractArtifactsPathResolver` and `custom` for custom resolvers.

Usage of each of those would be specified in the documentation and as an example at the top of the file will be provided.

More info about the contract resolvers can be found in the "Interfaces and schemas for the main logical input objects and resolvers" specification.

## baseline workgroup setup:organisation

The syntax of this command would be `baseline workgroup setup:organisation [organisationName]`.

The `organisationName` parameter would specify the name of the organisation being setup.

The purpose of this command is to output `${organisationName}-organisation-config.json`. The purpose of the resulting artifact is to be supplied as an argument to the organisation registration command of the `baseline` CLI.

### Purpose of the resulting artifact

```json
{
	"organisationName": string,
	"organisation": {
		"resolver": {
			"type": string,
			"value": string, 
			"extra": string
		}
	}
}
```

The main purpose of this artifact is to specify the resolver for the organisation configuration.

The `type` property of this resolver config will have several predefined values. In the first version these will be `path` - resolving to the `OrganisationConfigPathResolver` , `raw` - allowing these to be passed through the `value` parameter as string that can be parsed, and `custom` for custom resolvers.

Usage of each of those would be specified in the documentation and an example will be provided at the top of the file.

More info about the organisation resolvers can be found in the "Interfaces and schemas for the main logical input objects and resolvers" specification.

## baseline workgroup setup:workflow

The syntax of this command would be `baseline workgroup setup:workflow [workflowName]`.

The `circuitName` parameter would specify the name of the circuit being setup.

The purpose of this command is to output `${workflowName}-config.json`. The purpose of the resulting artifact is to be supplied as an argument to the workflow registration command of the `baseline` CLI.

### Purpose of the resulting artifact

```json
{
	"workflowName": string,
	"verification-key": {
		"resolver": {
			"type": string,
			"value": string, 
			"extra": string
		}
	}
}
```

As the workflows are currently defined in zero-knowledge circuits, the main artifacts needed to register workflow is the name of the workflow and the verification keys for this workflow. The main purpose of this artifact is to specify the resolver for the verification keys of this workflow.

The `type` property of this resolver config will have several predefined values. In the first version these will be `path` - resolving to the `VerifierKeyPathResolver` and `custom` for custom resolvers.

Usage of each of those would be specified in the documentation and an example configuration will be provided at the top of the file.

More info about the verification key resolvers can be found in the "Interfaces and schemas for the main logical input objects and resolvers" specification.