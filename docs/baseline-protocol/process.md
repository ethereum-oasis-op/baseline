# Baseline Process

## Baselining Step-by-Step

### Local System of Record

Parties store data in local systems of record \(mongo, oracle, sap,...could even be a private or public blockchain, etc\). A "baseline server" is given CRUD access to this, if the system of record itself is not already "baseline compliant/enabled" \(which we'd hope is typical in future\).

### Setting up the Workgroup and Sending Messages to Counterparties

After setting up a Workgroup on-chain of verified counterparties for a specific Workflow \(which instantiates three on-chain contracts: verifier, orgRegistry, shield\), a Party's baseline server serializes a record to be "baselined" and optionally includes with it a codebook that will govern subsequent workflow steps that either change the state of the record or parameterize part or all of the record into a new function. The codebook could be written in any language, but today, Solidity is convenient. \(And it is important to note that the Radish34 demo does not use a "codebook" in this way, because the workflow it implements is governed by a custom Zokrates circuit labeled "MSA." More on that elsewhere.\)

The data and codebook are packaged and sent via a point-to-point secret messenger service to one or more selected counterparties, who are also equipped with a baseline-compliant system. They receive the package, deposit the data, store and run the code, digitally sign the output, and send that back to the initiating Party.

### Processing for Consistency and Sending the Baseline Proof to the Mainnet

That initiating Party sends all counterparty-signed messages into a zero knowledge microservice inside the baseline server that uses either a basic "everyone did things the same" zero knowledge circuit or a more advanced, specific one that may, for example, enforce certain "correctness" conditions \(e.g., "I am a volume discount rate table, and I must have no gaps between levels"\). Note: zero knowledge enforcement of "correctness" is more expensive, but techniques being introduced by EY can reduce net expense by 5x or more. Also note that such enforcement is not strictly necessary in cases where counterparties are not worried about the shared code being faulty.\)

The zk service then sends a commitment \(the "baseline proof" of this workflow step\) in the form of a hash \(plus other material used for verification\) to the shield contract created during Workgroup setup. The shield contract makes a call to the verifier contract, and if the verifier contract returns "true" then the shield contract deposits the hash into the merkel trie contained inside itself.

### What's the Use of Putting the Baseline Proof on the Mainnet?

The key to the utility of the baseline proof being on-chain is that the hash represents shared state \(and of course, tamper resistant shared state\), not just "proof of existence". It is a "state marker" that can, for example, represent the current volume of orders in a procurement agreement. Updates to the state \(e.g., when a new order raises the current volume\) can nullify the previous baseline proof. In this way, it can be used for subsequent calculations to prevent later workflow steps from double-counting, providing deliberately or accidentally erroneous inputs, or changing the business rules. Such actions would result in the subsequent workflow step failing to deposit its baseline proof on-chain, at which point the flow stops, parties are alerted, and corrections can be made. Also the hash can be used as the key in a key-value pair -- or the key in an off-chain value lookup procedure. We put that hash in a shield contract mainly to hide who is doing what to it...and we also get some nice features like merkle root grouping, ordering, etc.

### A Word About Tokenization

The utilitarian value of tokens is the value associated with a business process or asset that has a denominational value, cannot be double spent and can be traded or transacted between entities. Baseline proof when extended to the payload in standard tokens \(ERC721 or ERC20 or ERC1155\), can be used to trade tokens. In the case of Radish34 implementation, this is represented by a purchase order, wherein a purchase order can be identified as a token commitment that is moved across entities via escrow \(shield\) contract account on the mainnet.

Tokenization of assets, and the on-chain transfer of them, can then use the baseline proof as the payload in an ERC721, which can also be done under the shield contract, so that what the world sees is...essentially nothing: "someone sent something to someone...and the something was a nonsense set of characters that only the direct counterparties know is anything at all." Done on a cadence with "chaff" hashes thrown in, and analysis techniques wouldn't be able to get a signal they could use to learn much of anything about the Parties' business activities or relationships.

