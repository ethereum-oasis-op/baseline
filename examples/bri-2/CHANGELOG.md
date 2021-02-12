# Change Log

## Alpha Release [0.1.0] 2021-01-28
[X] started project Baseline Chain Switcher Demo and Components
[X] added UI Dashboard

## [0.1.1] 2021-01-29
[X] added commit-mgr service tests report to dashboard
[X] commit-mgr should be configurable via env vars such that it can use Infura as its web3 provider
[ ] a repeatable test suite should be written to ensure baseline transactions can be submitted through Infura
[X] Shield.sol and Verifier.sol contracts should be deployed on a public testnet/mainnet (verifiable via etherscan or similar)
[ ] root/leaves of on-chain merkle-tree in Shield contract should match root/leaves of off-chain tree stored in mongo
[X] commitments made in private Besu network should be replicated on public testnet/mainnet

### Bonus features:
[X] add Well-Known DID configuration generator
[X] add simple Baseline Phonebook UI
[ ] use a faucet account or another way to fund public testnet/mainnet transactions so that judges can easily run test suite.
[ ] find a way to securely+efficiently move what has already gone to the private Besu chain instance and move that to the public ethereum mainnet before commencing with new transactions.
[ ] the verification circuit enforces some business logic (instead of using a no-op circuit)
[X] add a UI that allows the user to configure the commit-mgr service

## Alpha Release [0.1.3] 2021-02-10
[X] commit-mgr updated
[X] dashboard UI moved to ./bri-2 folder
[X] DID service moved to ./bri-2 folder