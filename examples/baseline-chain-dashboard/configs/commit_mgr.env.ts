//import * as dotenv from 'dotenv';
//dotenv.config();
import { readFileSync } from 'fs';
// Include envfile
import { parse, stringify } from 'envfile';

export const commitMgrServerUrl = 'http://localhost:4001';

export default function commitMgrEnv() {

    const fileEnvLocal = readFileSync('./.env.localdev', 'utf-8');
    const fileEnvLive = readFileSync('./.env.network', 'utf-8');

    const fileEnvParsed = parse(fileEnvLive);
    const fileEnvLocalParsed = parse(fileEnvLocal);
  
    const regex = /['"]+/g;
    const updatedEnv = {
      NodeEnv: fileEnvLocalParsed.NODE_ENV.replace(regex, ''),
      LogLevel: fileEnvLocalParsed.LOG_LEVEL.replace(regex, ''),
      ServerPort: fileEnvLocalParsed.SERVER_PORT.replace(regex, ''),
      DatabaseUser: fileEnvLocalParsed.DATABASE_USER.replace(regex, ''),
      DatabaseName: fileEnvLocalParsed.DATABASE_NAME.replace(regex, ''),
      DatabasePassword: fileEnvLocalParsed.DATABASE_PASSWORD.replace(regex, ''),
      DatabaseHost: fileEnvLocalParsed.DATABASE_HOST.replace(regex, ''),
      EthClientType: fileEnvParsed.ETH_CLIENT_TYPE.replace(regex, ''),
      InfuraId: fileEnvParsed.INFURA_ID ? fileEnvParsed.INFURA_ID.replace(regex, '') : '',
      EthClientWs: fileEnvParsed.ETH_CLIENT_WS.replace(regex, ''),
      EthClientHttp: fileEnvParsed.ETH_CLIENT_HTTP.replace(regex, ''),
      ChainId: fileEnvParsed.CHAIN_ID.replace(regex, ''),
      WalletPrivateKey: fileEnvParsed.WALLET_PRIVATE_KEY.replace(regex, ''),
      WalletPublicKey: fileEnvParsed.WALLET_PUBLIC_KEY.replace(regex, ''),
      LocalEthClientType: fileEnvLocalParsed.ETH_CLIENT_TYPE.replace(regex, ''),
      LocalEthClientWs: fileEnvLocalParsed.ETH_CLIENT_WS.replace(regex, ''),
      LocalEthClientHttp: fileEnvLocalParsed.ETH_CLIENT_HTTP.replace(regex, ''),
      LocalChainId: fileEnvLocalParsed.CHAIN_ID.replace(regex, ''),
      LocalWalletPrivateKey: fileEnvLocalParsed.WALLET_PRIVATE_KEY.replace(regex, ''),
      LocalWalletPublicKey: fileEnvLocalParsed.WALLET_PUBLIC_KEY.replace(regex, '')
    };
  
    return updatedEnv;
}