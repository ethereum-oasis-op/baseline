import React from "react";
import { useWallet } from 'use-wallet';
import FormSettings from "components/Forms/FormSettings.js";
import Admin from "layouts/Admin.js";
import axios from "axios";
import { commitMgrUrl } from "../../components/Forms/FormSettings.js";

export function commitMgrEnv() {
      const regex = /['"]+/g;
      let result;
      
      axios.get(`${commitMgrUrl}/settings`)
        .then((res) => {
            //access the resp here....
            const body = res.data;
            result = {
              NodeEnv: body.NODE_ENV.replace(regex, ''),
              LogLevel: body.LOG_LEVEL.replace(regex, ''),
              ServerPort: body.SERVER_PORT.replace(regex, ''),
              DatabaseUser: body.DATABASE_USER.replace(regex, ''),
              DatabaseName: body.DATABASE_NAME.replace(regex, ''),
              DatabasePassword: body.DATABASE_PASSWORD.replace(regex, ''),
              DatabaseHost: body.DATABASE_HOST.replace(regex, ''),
              EthClientType: body.ETH_CLIENT_TYPE.replace(regex, ''),
              InfuraId: body.INFURA_ID ? body.INFURA_ID.replace(regex, '') : '',
              EthClientWs: body.ETH_CLIENT_WS.replace(regex, ''),
              EthClientHttp: body.ETH_CLIENT_HTTP.replace(regex, ''),
              ChainId: body.CHAIN_ID.replace(regex, ''),
              WalletPrivateKey: body.WALLET_PRIVATE_KEY.replace(regex, ''),
              WalletPublicKey: body.WALLET_PUBLIC_KEY ? body.WALLET_PUBLIC_KEY.replace(regex, '') : '',
              LocalEthClientType: body.ETH_CLIENT_TYPE.replace(regex, ''),
              LocalEthClientWs: body.ETH_CLIENT_WS.replace(regex, ''),
              LocalEthClientHttp: body.ETH_CLIENT_HTTP.replace(regex, ''),
              LocalChainId: body.CHAIN_ID.replace(regex, ''),
              LocalWalletPrivateKey: body.WALLET_PRIVATE_KEY.replace(regex, ''),
              LocalWalletPublicKey: body.WALLET_PUBLIC_KEY.replace(regex, '')
            };
        })
        .catch((error) => {
            console.log(error);
            Alert('error', 'ERROR...', "OOPS that didn't work :(");
        });
    return result;
}

// This function gets called at build time
export async function getStaticProps() {
  return {
    props: { ...commitMgrEnv() },
  }
}

export default function Settings(props) {
  const wallet = useWallet();
  
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          <FormSettings wallet={wallet} {...props} />
        </div>
      </div>
    </>
  );
}

Settings.layout = Admin;
