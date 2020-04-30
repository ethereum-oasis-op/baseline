# Baseline CLI

The Baseline command-line interface will provide a variety of tools for deploying, managing and interacting with different components of baseline.

In its initial version, it will be a utility for baseline workgroup organizers to set-up, deploy, configure and manage baseline workgroup smart contracts. In the future, this CLI will be extended to support further administrative functions.

Similar to other popular CLI tools, the `baseline` tool will be installable through npm (ex. `firebase`, `truffle`, `etherlime`, etc).

```bash
npm install -g baseline-tools
```

At its initial version several commands need to be supported:

- `baseline workgroup setup` - allowing you to create different configuration files - [Specs](./baseline-workgroup/baseline-workgroup-setup.md)
- `baseline workgroup deploy` - allowing you to deploy the smart contracts for the workgroup
- `baseline workgroup add:organisation` - allowing you to register a new organisation in the workgroup
- `baseline workgroup add:workflow` - allowing you to register a new workflow by uploading its verification key.