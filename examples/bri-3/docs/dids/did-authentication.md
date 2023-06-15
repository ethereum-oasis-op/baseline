# Bri-3 DID Auth

## DIDs Explanation

[W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/) (DIDs) are cryptographically variable, globally unique identifiers. By utilizing DIDs for authentication, they enable a decentralized and self-sovereign approach to digital identity, where users have control over their own identity data and can prove their identity without relying on centralized authorities.

In context of Bri-3, they are designed to enable users (BpiSubjects) to

1. Register/generate their own unique identifiers
2. Prove their control over them by authenticating using digital signatures
3. Obtain an access token as a proof of their authenticated identity that can be reused over time

So that no sensitive information would be revealed during the business activities.

## Variables Explanation

**GOERLI_RPC_URL**="" # Any GOERLI RPC url i.e. "https://rpc.ankr.com/eth_goerli". This is used to resolve dids

**GOERLI_SERVICE_DID**="did:ethr:0x5:<bpi_operator_public_key>" # bpi_operator_public_key = public key of the bpi operator that represents the issuer of the JWT token

where 
1. did - the did URI scheme identifier
2. ethr - the identifier for the DID method
3. 0x5 - Specify GOERLI Test Network
4. <bpi_operator_public_key> - the DID method-specific identifier

**GOERLI_SERVICE_SIGNER_PRIVATE_KEY**="<bpi_operator_private_key>" # bpi_operator_private_key = private key of the bpi operator that is used to sign the issued JWT token

**SERVICE_URL**="bri-3" # JWT token audience

## Authentication Flow Explanation

1. (Prerequisite) The BpiOperators first must configure their own .env files with the .env.sample and register a BpiSubjects’ DID and public keys in the database.
2. BpiSubject sends POST /auth/login to Service and provides their public key
3. BpiOperator receives the response, resolves the DID to its DID Document and retrieves the key used from the `authentication` property, and then verifies the message signature with the `authentication` key. Then the BPI Operator generates an access (JWT) token for a successfully authorized account using BpiOperator’s private key.
4. BpiSubject authenticates next HTTP request using the received access (JWT) token that is signed by their metamask public key
5. BpiOperator receives the request, provides a resolver, verifies the token and stores the did document in a verifiable data registry, associating with the BpiSubject’s identity

## Reference
1. [PR #606](https://github.com/eea-oasis/baseline/pull/606)
2. [DID authentication](https://rsksmart.github.io/rif-identity-docs/ssi/specs/did-auth.html#how-to-send-tokens)
3. [W3C Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#dfn-did-subjects)