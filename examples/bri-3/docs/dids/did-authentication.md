# Bri-3 DID Auth

## DIDs Explanation

[W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/) (DIDs) are cryptographically variable, globally unique identifiers. By utilizing DIDs for authentication, they enable a decentralized and self-sovereign approach to digital identity, where users have control over their own identity data and can prove their identity without relying on centralized authorities.

In context of Bri-3, they are designed to enable users (BpiSubjects) to

1. Register/generate their own unique identifiers
2. Prove BpiSubjects' control over their identities by authenticating using digital signatures
3. Obtain an access token as a proof of their authenticated identity that can be reused over time

Hence, Bri-3 utilizes the self-sovereign nature of decentralized identifiers (DIDs) to effectively protect sensitive information during business activities.

## Environment Variables Explanation

**GOERLI_RPC_URL**= "<Any GOERLI_RPC_URL i.e. _https://rpc.ankr.com/eth_goerli_>"

#This is used to resolve dids. 

**GOERLI_SERVICE_DID**="did:ethr:0x5:<bpi_operator_public_key>" 

#bpi_operator_public_key = public key of the bpi operator that represents the issuer of the JWT token. Users can retrieve their public key by accessing their blockchain account settings or using a wallet provider like [MetaMask](https://metamask.io/).

where 
1. did - the did URI scheme identifier
2. ethr - the identifier for the DID method
3. 0x5 - Specify GOERLI Test Network
4. bpi_operator_public_key - the DID method-specific identifier

**GOERLI_SERVICE_SIGNER_PRIVATE_KEY**="<bpi_operator_private_key>" 

#bpi_operator_private_key = private key of the bpi operator that is used to sign the issued JWT token. Similar to the public key. For more information on how to view and access the public and private keys, please refer to the [MetaMask support](https://support.metamask.io/hc/en-us/articles/360015488791-How-to-view-your-account-details-and-public-address).

**SERVICE_URL**="bri-3" 

#JWT token audience

## Authentication Flow Explanation

1. (Prerequisite) The BpiOperators first must configure their own .env files with the .env.sample and register a BpiSubject's DID and public keys in the database.
2. BpiSubject signs into the Service using their MetaMask account and sends POST /auth/nonce to Service with their public key. The Service generates a nonce and BpiSubject signs the received nonce using their private key to create a signature. Then BpiSubject sends POST /auth/login to Service, providing their public key and signature.
3. BpiOperator receives the response, resolves the DID to its DID Document, retrieves the key used from the `authentication` property, and verifies the message signature with the `authentication` key. Then the BPI Operator generates an access (JWT) token for a successfully authorized account using BpiOperator’s private key.
4. BpiSubject authenticates next HTTP request using the received access (JWT) token that is signed by their public key.
5. BpiOperator receives the request, verifies the token, and, if successful, routes the request to the target service. If the token verification fails (e.g. expiration), a failure message is generated, and the request is not routed to its target service.

## Reference
1. [PR #606](https://github.com/eea-oasis/baseline/pull/606)
2. [DID authentication](https://rsksmart.github.io/rif-identity-docs/ssi/specs/did-auth.html#how-to-send-tokens)
3. [W3C Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/#dfn-did-subjects)