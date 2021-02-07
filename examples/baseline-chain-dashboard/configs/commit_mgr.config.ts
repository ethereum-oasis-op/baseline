import * as dotenv from 'dotenv';
dotenv.config();

export default {
    NodeEnv: process.env.NODE_ENV ?? '',
    LogLevel: process.env.LOG_LEVEL ?? '',
    ServerPort: process.env.SERVER_PORT ?? '',
    DatabaseUser: process.env.DATABASE_USER ?? '', 
    DatabaseName: process.env.DATABASE_NAME ?? '', 
    DatabasePassword: process.env.DATABASE_PASSWORD ?? '', 
    DatabaseHost: process.env.DATABASE_HOST ?? '',
    EthClientType: process.env.ETH_CLIENT_TYPE ?? '',
    InfuraId: process.env.INFURA_ID ?? '',
    EthClientWs: process.env.ETH_CLIENT_WS ?? '',
    EthClientHttp: process.env.ETH_CLIENT_HTTP ?? '',
    ChainId: process.env.CHAIN_ID ?? '',
    WalletPrivateKey: process.env.WALLET_PRIVATE_KEY ?? '',
    WalletPublicKey: process.env.WALLET_PUBLIC_KEY ?? ''
}