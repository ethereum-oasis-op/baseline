# Sort out production/development processes for switching between the types of networks

## When I want to check the network

Right now this folder wants to be in charge of
- Connecting to the RPC server based on env variables
- We would want one location to be able to easily bounce between networks
- submitted
- mined by x blocks
- block number
- saving the tx hashes 


## considerations

We may have to splinter our large database of all msa, rfp, ect for each network
- db will then have to know what context (rpcProvider) the user is connected to, switch to that db and serve responses
- perhaps we can also add clientSettings
- connecting to all rpcProviders in order to listen to them ?
- pull balance from metamask directly
