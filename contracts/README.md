# Solidity Smart Contracts

## What is here?

This folder contains the solidity smart contracts component for managing the registration of companies/organizations that want to participant in the Baseline Supply Chain use case.

## How does this fit in to Radish?

During setup of a Baseline/Radish instance there is a registration process. This registration process creates a new record for the company performing the setup in a global registry. The record contains information like the company name, location, etc... It also contains important cryptographic identifiers that are used throughout the Baseline process. 

## How can I run it?

To compile and deploy the smart contracts do the following...

``` 
  TODO
```

To run the tests...

```
  TODO
```

## What is the architecture? 

![Architecture of smart contracts](../docs/assets/SmartContractArch.png)
As you can see from the diagram above there are the following contract compontents:

- RadishRegistar ERC1820 impl - This does X and is pre-deployed for all Radish participants to use
- Actions Controller ERC725 - This has not been built yet but we intend it to do Y
- Token Management - This also has not been built yet but it would do Z. 
<!---
In addition to the images add some description of them explaining each part of the diagram.
I know you think your images are beautiful, self-explanatory works of technical art but please,
for the sake of us dumb sods, write a little about them.
-->

## How can this be improved?

We think this can be improved by refactoring the org registry contract to use XYZ... Also, the something something needs better test coverage.
Find specific [issues for this component listed on github](https://github.com/EYBlockchain/radish-34/issues?q=is%3Aissue+is%3Aopen+label%3ADocumentation)
<!---
So that others know what you're planning on doing (and how they might help) 
write about or (ideally) link to existing issues in github that are important to advance the work on the project.
If you link please use github issue filter for your component label (and if you don't have a component label, make one).
E.g. https://github.com/EYBlockchain/radish-34/issues?q=is%3Aissue+is%3Aopen+label%3ADocumentation would show all the documentation issues that are open.
-->


