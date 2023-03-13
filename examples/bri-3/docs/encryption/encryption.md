# Encryption

## Description

Simple reference implementation currently supports encryption at rest for the Bpi Message Content property. This scope sets the basis for fullfiling requirements related to encryption from the Baseline Standard and will be expanded on in future work on the SRI.

## Implementation details

This functionality is implemented in the EncryptionModule, which exports a EncryptionService that exposes encrypt and decrypt methods. Functionality is built on top of [Jose](https://www.npmjs.com/package/jose) library which implements various JSON Web Standards, including the JSON Web Encryption (JWE) required by the standard.

Algorithm used for encryption is A128CBC-HS256. It is hardcoded in the EncryptionService with an intention to make it configurable in the future. Reasoning behind selecting this specific algorithm is trivial, it is the first one listed as supported by JOSE for shared symmetric key encryption. 

## Usage

Encryption key is stored in the .env file and is read by the EncryptionService during Encrypt\Decrypt operations.

Encrypt method is invoked in the BpiMessageStorageAgent, just before the BpiMessage content is to be stored in the DB as part of Create\Update actions.

Decrypt method is invoked in the BpiMessageStorageAgent, just after a specific BpiMessage has been fetched from the DB.
