import { logger } from "../logger";
import * as fs from 'fs';
import * as path from 'path';

export const saveEnv = async (settings: any) => {
    const fileContent = `# Set to production when deploying to production
      NODE_ENV="development"
      LOG_LEVEL="debug"

      # Node.js server configuration
      SERVER_PORT=4001

      # MongoDB configuration for the JS client
      DATABASE_USER="${settings.DATABASE_USER}"
      DATABASE_PASSWORD="${settings.DATABASE_PASSWORD}"
      DATABASE_HOST="${settings.DATABASE_HOST}"
      DATABASE_NAME="${settings.DATABASE_NAME}"

      # Ethereum client
      # "ganache": local, private ganache network
      # "besu": local, private besu network
      # "infura-gas": Infura's Managed Transaction (ITX) service
      # "infura": Infura's traditional jsonrpc API
      ETH_CLIENT_TYPE="${settings.LOCAL_ETH_CLIENT_TYPE}"

      # Local client endpoints
      # Websocket port
      # 8545: ganache
      # 8546: besu
      ETH_CLIENT_WS="${settings.LOCAL_ETH_CLIENT_WS}"
      ETH_CLIENT_HTTP="${settings.LOCAL_ETH_CLIENT_HTTP}"

      # Chain ID
      # 1: Mainnet
      # 3: Ropsten
      # 4: Rinkeby
      # 5: Goerli
      # 42: Kovan
      # 101010: Custom network (private ganache or besu network)
      CHAIN_ID=${settings.LOCAL_CHAIN_ID}

      # Ethereum account key-pair. Do not use in production
      WALLET_PRIVATE_KEY="${settings.LOCAL_WALLET_PRIVATE_KEY}"
      WALLET_PUBLIC_KEY="${settings.LOCAL_WALLET_PUBLIC_KEY}"`;

  fs.writeFile(path.join(__dirname, '../.env'), fileContent,  (err) => {
    if (err) {
        return logger.error(err);
    }
    logger.info(".env file created!");
  });
}
