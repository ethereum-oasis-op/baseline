import React from "react";
// Load Web3 and IPFS
import Web3 from 'web3';
import IpfsAPI from 'ipfs-api';
// Load EthAvatar
import EthAvatar from 'ethavatar';

export default function walletAvatar(accountAddress, httpProvider) {
    
    // Use local Web3 Provider
    const web3Provider = new Web3.providers.HttpProvider(httpProvider);
    const web3Connection = new Web3(web3Provider);

    /// Use Infura IPFS API
    const ipfsConnection = IpfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

    const ethavatar = new EthAvatar(
        web3Connection,
        ipfsConnection,
        accountAddress
    );

    //console.log(ethavatar);

    return ethavatar;
}