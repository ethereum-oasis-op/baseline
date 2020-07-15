#!/usr/bin/env bash
set -e

echo "\nStarting creation of development docker-compose.yml..."
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "dir=$dir"
project="`cat $dir/../package.json | grep '"name":' | head -n 1 | cut -d '"' -f 4`"

####################
# Load env vars

# alias env var
BASELINE_LOG_LEVEL="$LOG_LEVEL";

function extractEnv {
  grep "$1" "$2" | cut -d "=" -f 2- | tr -d '\n\r"' | sed 's/ *#.*//'
}

# First choice: use existing env vars (dotEnv not called)
# NOTE: .env file should reside in same directory as caller of this script (i.e. Makefile)
function dotEnv {
  key="$1"
  if [[ -f .env && -n "`extractEnv $key .env`" ]] # Second choice: load from custom secret env
  then extractEnv $key .env
  elif [[ -f env.dev.env && -n "`extractEnv $key env.dev.env`" ]] # Third choice: load from public defaults
  then extractEnv $key env.dev.env
  fi
}

echo "Initializing environment variables..."
export BASELINE_MESSENGER_PROVIDER="${BASELINE_MESSENGER_PROVIDER:-`dotEnv BASELINE_MESSENGER_PROVIDER`}"
export BASELINE_ZKP_MODE="${BASELINE_ZKP_MODE:-`dotEnv BASELINE_ZKP_MODE`}"
export BASELINE_ETH_PROVIDER="${BASELINE_ETH_PROVIDER:-`dotEnv BASELINE_ETH_PROVIDER`}"
export BASELINE_NPM_PACKAGE="${BASELINE_NPM_PACKAGE:-`dotEnv BASELINE_NPM_PACKAGE`}"
export BASELINE_LOG_LEVEL="${BASELINE_LOG_LEVEL:-`dotEnv BASELINE_LOG_LEVEL`}"
export BASELINE_ADMIN_TOKEN="${BASELINE_ADMIN_TOKEN:-`dotEnv BASELINE_ADMIN_TOKEN`}"
BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY="${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY:-`dotEnv BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY`}"
BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY="${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY:-`dotEnv BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY`}"

# Parse BASELINE_ETH_PROVIDER to create websocket URI required by merkle-tree service
blockchain_proto="$(echo $BASELINE_ETH_PROVIDER | grep :// | sed -e's,^\(.*://\).*,\1,g')"
blockchain_url="$(echo ${BASELINE_ETH_PROVIDER/$blockchain_proto/})"
blockchain_host="$(echo $blockchain_url | sed -e 's,:.*,,g')"
blockchain_port="$(echo $blockchain_url | sed -e 's,^.*:,:,g' -e 's,.*:\([0-9]*\).*,\1,g' -e 's,[^0-9],,g')"

# Make sure keys have proper newlines inserted
# (bc GitHub Actions strips newlines from secrets)
export BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY=`
  echo $BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY | tr -d '\n\r' |\
  sed 's/-----BEGIN RSA PRIVATE KEY-----/\\\n-----BEGIN RSA PRIVATE KEY-----\\\n/' |\
  sed 's/-----END RSA PRIVATE KEY-----/\\\n-----END RSA PRIVATE KEY-----\\\n/'`

export BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY=`
  echo $BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY | tr -d '\n\r' |\
  sed 's/-----BEGIN PUBLIC KEY-----/\\\n-----BEGIN PUBLIC KEY-----\\\n/' | \
  sed 's/-----END PUBLIC KEY-----/\\\n-----END PUBLIC KEY-----\\\n/'`

# If BASELINE_MESSENGER_PROVIDER=="whisper" then we need Ethereum clients
# with whisper enabled to act as the messenger service provider.
if [[ "$BASELINE_MESSENGER_PROVIDER" == "whisper" ]]
then
  messenger_providers="
  geth-node:
    hostname: geth-node
    container_name: geth-node
    depends_on:
       - geth-miner1
       - geth-miner2
    env_file:
      - ./geth-env/node/docker.env
    build:
      context: ./geth-env
      dockerfile: ./node/Dockerfile
      args:
        privatekey: 54c68a6104df07a9661b9b8fe1106263feeeddfd67aed8dafed1438040e421d1
        password: word
    networks:
      - network-buyer
      - network-supplier1
      - network-supplier2
      - network-geth
    ports:
       - 8547:8545
       - 8548:8546
    healthcheck:
      test: ["CMD", "wget", "-q", "http://localhost:8545"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  geth-bootnode:
    hostname: geth-bootnode
    container_name: geth-bootnode
    env_file:
      - ./geth-env/bootnode/docker.env
    build:
      context: ./geth-env
      dockerfile: ./bootnode/Dockerfile
    networks:
      network-geth:
        ipv4_address: 172.25.0.101 # The miners need to know the IP address later on
    ports:
      - 30301:30301/udp

  geth-miner1:
    hostname: geth-miner1
    container_name: geth-miner1
    depends_on:
      - geth-bootnode
    env_file:
      - ./geth-env/miner/miner_1.env
    ports:
      - 8544:8545/tcp
    networks:
      - network-geth
    build:
      context: ./geth-env
      dockerfile: ./miner/Dockerfile
      args:
        privatekey: df504d175ae63abf209bad9dda965310d99559620550e74521a6798a41215f46
        password: pass
    healthcheck:
      test: ["CMD", "wget", "-q", "http://localhost:8545"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  geth-miner2:
    hostname: geth-miner2
    container_name: geth-miner2
    depends_on:
      - geth-bootnode
    env_file:
      - ./geth-env/miner/miner_2.env
    ports:
      - 8542:8545/tcp
    networks:
      - network-geth
    build:
      context: ./geth-env
      dockerfile: ./miner/Dockerfile
      args:
        privatekey: bc5b578e0dcb2dbf98dd6e5fe62cb5a28b84a55e15fc112d4ca88e1f62bd7c35
        password: word
    healthcheck:
      test: ["CMD", "wget", "-q", "http://localhost:8545"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s "
elif [[ "$BASELINE_MESSENGER_PROVIDER" == "nats" ]]
then
  messenger_providers="
  nats:
    container_name: nats
    image: provide/nats-server
    command: ["-auth", "testtoken", "-p", "4222", "-D", "-V"]
    environment: 
      JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    healthcheck:
      test: ["CMD", "/usr/local/bin/await_tcp.sh", "localhost:4222"]
      interval: 1m
      timeout: 1s
      retries: 2
      start_period: 10s
    hostname: nats
    networks:
      - network-buyer
    ports:
      - 4221:4221
      - 4222:4222
    restart: always
    volumes:
      - ./ops/await_tcp.sh:/usr/local/bin/await_tcp.sh:cached "
else
  messenger_providers=""
fi

# If BASELINE_NPM_PACKAGE=="local" then mount baseline/core/messaging files to
# the docker containers' file system. This allows local modifications to be 
# picked up by the docker containers. Otherwise, that npm package will be 
# installed from the remote npm registry.
if [[ "$BASELINE_NPM_PACKAGE" == "local" ]]
then

  # Build local @baseline-protocol/messaging node package
  pushd ../../core/messaging
  # Install node_modules if the directory doesn't exist
  if [[ ! -d ./node_modules ]]
  then
    npm install
  fi
  npm run build
  popd

  messenger_services="
  messenger-buyer:
    hostname: messenger-buyer
    container_name: messenger-buyer
    depends_on:
      - mongo-buyer
      - redis-buyer
      - geth-node
    build:
      context: ./messenger
      dockerfile: ./Dockerfile
    env_file:
      - ./messenger/config/docker.env
    environment:
      LOG_LEVEL: ${BASELINE_LOG_LEVEL}
      MESSENGER_PROVIDER: ${BASELINE_MESSENGER_PROVIDER}
      DB_URL: mongodb://mongo-buyer:27017/radish34
      MESSENGER_API_PORT: 4001
      CLIENT_URL: ws://geth-node:8546
      RADISH_API_URL: http://api-buyer:8101
      REDIS_URL: redis://redis-buyer:6379
      NATS_JWT_SIGNER_PRIVATE_KEY: ${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY}
      NATS_JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    networks:
      - network-buyer
    ports:
     - 4001:4001
    volumes:
      - ../../core/messaging:/app/node_modules/@baseline-protocol/messaging:delegated
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4001/api/v1/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  messenger-supplier1:
    hostname: messenger-supplier1
    container_name: messenger-supplier1
    depends_on:
      - mongo-supplier1
      - redis-supplier1
      - geth-node
    env_file:
      - ./messenger/config/docker.env
    build:
      context: ./messenger
      dockerfile: ./Dockerfile
    environment:
      LOG_LEVEL: ${BASELINE_LOG_LEVEL}
      MESSENGER_PROVIDER: ${BASELINE_MESSENGER_PROVIDER}
      DB_URL: mongodb://mongo-supplier1:27017/radish34
      MESSENGER_API_PORT: 4001
      CLIENT_URL: ws://geth-node:8546
      RADISH_API_URL: http://api-supplier1:8101
      REDIS_URL: redis://redis-supplier1:6379
      NATS_JWT_SIGNER_PRIVATE_KEY: ${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY}
      NATS_JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    networks:
      - network-supplier1
    ports:
     - 4002:4001
    volumes:
      - ../../core/messaging:/app/node_modules/@baseline-protocol/messaging:delegated
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4001/api/v1/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  messenger-supplier2:
    hostname: messenger-supplier2
    container_name: messenger-supplier2
    depends_on:
      - mongo-supplier2
      - redis-supplier2
      - geth-node
    env_file:
      - ./messenger/config/docker.env
    build:
      context: ./messenger
      dockerfile: ./Dockerfile
    environment:
      LOG_LEVEL: ${BASELINE_LOG_LEVEL}
      MESSENGER_PROVIDER: ${BASELINE_MESSENGER_PROVIDER}
      DB_URL: mongodb://mongo-supplier2:27017/radish34
      MESSENGER_API_PORT: 4001
      CLIENT_URL: ws://geth-node:8546
      RADISH_API_URL: http://api-supplier2:8101
      REDIS_URL: redis://redis-supplier2:6379
      NATS_JWT_SIGNER_PRIVATE_KEY: ${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY}
      NATS_JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    networks:
      - network-supplier2
    ports:
      - 4003:4001
    volumes:
      - ../../core/messaging:/app/node_modules/@baseline-protocol/messaging:delegated
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4001/api/v1/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s "
else
  messenger_services="
  messenger-buyer:
    hostname: messenger-buyer
    container_name: messenger-buyer
    depends_on:
      - mongo-buyer
      - redis-buyer
      - geth-node
    build:
      context: ./messenger
      dockerfile: ./Dockerfile
    env_file:
      - ./messenger/config/docker.env
    environment:
      LOG_LEVEL: ${BASELINE_LOG_LEVEL}
      MESSENGER_PROVIDER: ${BASELINE_MESSENGER_PROVIDER}
      DB_URL: mongodb://mongo-buyer:27017/radish34
      MESSENGER_API_PORT: 4001
      CLIENT_URL: ws://geth-node:8546
      RADISH_API_URL: http://api-buyer:8101
      REDIS_URL: redis://redis-buyer:6379
      NATS_JWT_SIGNER_PRIVATE_KEY: ${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY}
      NATS_JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    networks:
      - network-buyer
    ports:
     - 4001:4001
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4001/api/v1/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  messenger-supplier1:
    hostname: messenger-supplier1
    container_name: messenger-supplier1
    depends_on:
      - mongo-supplier1
      - redis-supplier1
      - geth-node
    env_file:
      - ./messenger/config/docker.env
    build:
      context: ./messenger
      dockerfile: ./Dockerfile
    environment:
      LOG_LEVEL: ${BASELINE_LOG_LEVEL}
      MESSENGER_PROVIDER: ${BASELINE_MESSENGER_PROVIDER}
      DB_URL: mongodb://mongo-supplier1:27017/radish34
      MESSENGER_API_PORT: 4001
      CLIENT_URL: ws://geth-node:8546
      RADISH_API_URL: http://api-supplier1:8101
      REDIS_URL: redis://redis-supplier1:6379
      NATS_JWT_SIGNER_PRIVATE_KEY: ${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY}
      NATS_JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    networks:
      - network-supplier1
    ports:
     - 4002:4001
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4001/api/v1/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  messenger-supplier2:
    hostname: messenger-supplier2
    container_name: messenger-supplier2
    depends_on:
      - mongo-supplier2
      - redis-supplier2
      - geth-node
    env_file:
      - ./messenger/config/docker.env
    build:
      context: ./messenger
      dockerfile: ./Dockerfile
    environment:
      LOG_LEVEL: ${BASELINE_LOG_LEVEL}
      MESSENGER_PROVIDER: ${BASELINE_MESSENGER_PROVIDER}
      DB_URL: mongodb://mongo-supplier2:27017/radish34
      MESSENGER_API_PORT: 4001
      CLIENT_URL: ws://geth-node:8546
      RADISH_API_URL: http://api-supplier2:8101
      REDIS_URL: redis://redis-supplier2:6379
      NATS_JWT_SIGNER_PRIVATE_KEY: ${BASELINE_NATS_JWT_SIGNER_PRIVATE_KEY}
      NATS_JWT_SIGNER_PUBLIC_KEY: ${BASELINE_NATS_JWT_SIGNER_PUBLIC_KEY}
    networks:
      - network-supplier2
    ports:
      - 4003:4001
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4001/api/v1/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s "
fi

echo "Creating /config/docker-compose.tmp.yml file..."
mkdir -p config/
cat - > config/docker-compose.tmp.yml <<EOF
version: '3.5'

services:
  $messenger_providers
  $messenger_services

  deploy:
    container_name: deployer-service
    build:
      context: ./deploy/
    depends_on:
      - ganache
      - messenger-buyer
      - messenger-supplier1
      - messenger-supplier2
      - mongo-buyer
      - mongo-supplier1
      - mongo-supplier2
      - zkp
    environment:
      RPC_PROVIDER: ${BASELINE_ETH_PROVIDER}
      MESSENGER_BUYER_URI: http://messenger-buyer:4001
      MESSENGER_SUPPLIER1_URI: http://messenger-supplier1:4001
      MESSENGER_SUPPLIER2_URI: http://messenger-supplier2:4001
      ZKP_URL: http://zkp:80
      ZKP_MODE: ${BASELINE_ZKP_MODE:-0}
      KEYSTORE_PATH: /app/src/config/keystore
      ORGANISATION_CONFIG_PATH: /app/src/config
      CONTRACTS_PATH: /app/paths-contracts.json
    networks:
      - network-buyer
      - network-supplier1
      - network-supplier2
    volumes:
      - ./deploy/src:/app/src:delegated
      - ./deploy/package.json:/app/package.json:delegated
      - ./deploy/paths-contracts.json:/app/paths-contracts.json:delegated
      - ./contracts/artifacts:/app/artifacts:delegated
      - ./config/keystore:/keystore:delegated
      - ./config:/app/src/config

  ui:
    container_name: radish34-ui
    build:
      context: ./ui/
      dockerfile: dev.Dockerfile
    depends_on:
      - ganache
      - messenger-buyer
      - messenger-supplier1
      - messenger-supplier2
      - mongo-buyer
      - mongo-supplier1
      - mongo-supplier2
      - zkp
    volumes:
      - ./ui/src:/app/src:delegated
      - ./ui/.env:/app/.env:delegated
      - ./ui/public/index.html:/app/public/index.html:delegated
      - ./ui/public/favicon.ico:/app/public/favicon.ico:delegated
      - ./ui/public/config.js:/app/public/config.js:delegated
      - ./ui/public/manifest.json:/app/public/manifest.json:delegated
      - ./ui/public/logo.svg:/app/public/logo.svg:delegated
      - ./ui/public/images:/app/public/images:delegated
      - ./ui/public/fonts:/app/public/fonts:delegated
    networks:
      - network-buyer
      - network-supplier1
      - network-supplier2
    ports:
      - 3000:3000
    logging:
      options:
        max-size: 10m
    tty: true
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  ganache:
    container_name: shared-ganache
    image: trufflesuite/ganache-cli:latest
    command: ganache-cli -m 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat' --db='/chaindata' --defaultBalanceEther 10000 --account="0xdad57e191799c38233bb7897f5ca66eb42d4f2f6d05ec657f8121b57e5d3bde6, 1000000000000000000000" --account="0x5aaa244692f54da4335a8553249b0db34316fbbc6ec353e1404cf77c415e59e8, 1000000000000000000000" --account="0x70441f8ed88f91416fbe21aa007357354e9bc30236211eda0022bdfb27beb227, 1000000000000000000000" --account="0x9ff4f711a85ed35d2cc66323abcd83f41e5981e0cd395800a262beb9a92b8abf, 1000000000000000000000" --account="0x77e701995d56e775bbb06559ece7d7352157106bbadc6aa5d8781c86c8d824bd, 1000000000000000000000" --networkId '333' --gasLimit 10000000
    ports:
      - 8545:8545
    networks:
      - network-buyer
      - network-supplier1
      - network-supplier2
    volumes:
      - chaindata:/chaindata
      - ./ops/ganache_health.sh:/app/health-check.sh:delegated
    healthcheck:
      test: ["CMD", "sh", "health-check.sh"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  zkp:
    container_name: shared-zkp
    build:
      context: ./zkp/
      dockerfile: dev.Dockerfile
    command: npm run dev
    volumes:
      - ./zkp/circuits:/app/circuits:delegated
      - ./zkp/src:/app/src:delegated
      - ./zkp/dist:/app/dist:delegated
      - ./zkp/output:/app/output:delegated
    environment:
      PROVING_SCHEME: 'gm17'
      MONGO_URL: mongodb://mongo-buyer # TODO: radish-zkp's db of proving materials shouldn't depend on the Buyer's mongodb. Each user should probably read proving files from their local disk rather than from a shared mongodb?
      MONGO_DB_NAME: 'radish34'
      MONGO_CONNECTION_RETRIES: 5
    depends_on:
      - mongo-buyer # TODO: remove dependency on mongo-buyer.
    networks:
      - network-buyer
      - network-supplier1
      - network-supplier2
    ports:
      - 8080:80
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  api-buyer:
    container_name: api-buyer
    build:
      context: ./api/
      dockerfile: dev.Dockerfile
    command: npm run dev
    restart: on-failure
    volumes:
      - ./api/src:/app/src:delegated
      - ./api/dist:/app/dist:delegated
      - ./api/package.json:/app/package.json:delegated
      - ./config/keystore/buyer.eth:/keystore/account.eth
      - ./config/config-buyer.json:/app/config/default.json
      - ./contracts/artifacts:/app/artifacts:delegated
    depends_on:
      - mongo-buyer
      - ganache
      - messenger-buyer
      - redis-buyer
      - merkle-tree
    environment:
      MONGO_URL: mongodb://mongo-buyer
      MONGO_DB_NAME: 'radish34'
      MONGO_CONNECTION_RETRIES: 5
      MESSENGER_URI: http://messenger-buyer:4001
      REDIS_URL: redis://redis-buyer:6379
      ZKP_URL: http://zkp:80
      ZKP_MODE: ${BASELINE_ZKP_MODE:-0}
      MERKLE_TREE_URL: http://merkle-tree:80
    networks:
      - network-buyer
    ports:
      - 8001:8001
      - 8101:8101
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8001/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  api-supplier1:
    container_name: api-supplier1
    build:
      context: ./api/
      dockerfile: dev.Dockerfile
    command: npm run dev
    restart: on-failure
    volumes:
      - ./api/src:/app/src:delegated
      - ./api/dist:/app/dist:delegated
      - ./api/package.json:/app/package.json:delegated
      - ./config/keystore/supplier1.eth:/keystore/account.eth
      - ./config/config-supplier1.json:/app/config/default.json
      - ./contracts/artifacts:/app/artifacts:delegated
    depends_on:
      - mongo-supplier1
      - ganache
      - messenger-supplier1
      - redis-supplier1
      - merkle-tree
    environment:
      MONGO_URL: mongodb://mongo-supplier1
      MONGO_DB_NAME: 'radish34'
      MONGO_CONNECTION_RETRIES: 5
      MESSENGER_URI: http://messenger-supplier1:4001
      REDIS_URL: redis://redis-supplier1:6379
      ZKP_URL: http://zkp:80
      ZKP_MODE: ${BASELINE_ZKP_MODE:-0}
      MERKLE_TREE_URL: http://merkle-tree:80
    networks:
      - network-supplier1
    ports:
      - 8002:8001
      - 8102:8101
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8001/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  api-supplier2:
    container_name: api-supplier2
    build:
      context: ./api/
      dockerfile: dev.Dockerfile
    command: npm run dev
    restart: on-failure
    volumes:
      - ./api/src:/app/src:delegated
      - ./api/dist:/app/dist:delegated
      - ./api/package.json:/app/package.json:delegated
      - ./config/keystore/supplier2.eth:/keystore/account.eth
      - ./config/config-supplier2.json:/app/config/default.json
      - ./contracts/artifacts:/app/artifacts:delegated
    depends_on:
      - mongo-supplier2
      - ganache
      - messenger-supplier2
      - merkle-tree
    environment:
      MONGO_URL: mongodb://mongo-supplier2
      MONGO_DB_NAME: 'radish34'
      MONGO_CONNECTION_RETRIES: 5
      MESSENGER_URI: http://messenger-supplier2:4001
      REDIS_URL: redis://redis-supplier2:6379
      ZKP_URL: http://zkp:80
      ZKP_MODE: ${BASELINE_ZKP_MODE:-0}
      MERKLE_TREE_URL: http://merkle-tree:80
    networks:
      - network-supplier2
    ports:
      - 8003:8001
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8001/health"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  mongo-buyer:
    image: mongo:latest
    container_name: mongo-buyer
    volumes:
      - mongo-buyer:/data/db
      - ./ops/mongo_health.sh:/health-check.sh:delegated
    logging:
      options:
        max-size: 10m
    networks:
      - network-buyer
    ports:
      - 27117:27017
    healthcheck:
      test: ["CMD", "sh", "health-check.sh"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  mongo-supplier1:
    image: mongo:latest
    container_name: mongo-supplier1
    volumes:
      - mongo-supplier1:/data/db
      - ./ops/mongo_health.sh:/health-check.sh:delegated
    logging:
      options:
        max-size: 10m
    networks:
      - network-supplier1
    ports:
      - 27217:27017
    healthcheck:
      test: ["CMD", "sh", "health-check.sh"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  mongo-supplier2:
    image: mongo:latest
    container_name: mongo-supplier2
    volumes:
      - mongo-supplier2:/data/db
      - ./ops/mongo_health.sh:/health-check.sh:delegated
    logging:
      options:
        max-size: 10m
    networks:
      - network-supplier2
    ports:
      - 27317:27017
    healthcheck:
      test: ["CMD", "sh", "health-check.sh"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  redis-buyer:
    image: redis
    container_name: redis-buyer
    networks:
      - network-buyer
    ports:
      - 6379:6379
    healthcheck:
      test: ["CMD", "redis-cli", "PING"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  redis-supplier1:
    image: redis
    container_name: redis-supplier1
    networks:
      - network-supplier1
    expose:
      - 6379
    healthcheck:
      test: ["CMD", "redis-cli", "PING"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  redis-supplier2:
    image: redis
    container_name: redis-supplier2
    networks:
      - network-supplier2
    expose:
      - 6379
    healthcheck:
      test: ["CMD", "redis-cli", "PING"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

  merkle-tree:
    container_name: shared-merkle-tree
    image: eyblockchain/timber:v2.0.1
    restart: on-failure
    depends_on:
      - mongo-merkle-tree
      - ganache
    volumes: # ensure relative paths are correct if embedding this microservice in another application:
      - ./config/merkle-tree:/app/config # mount point might be different if configuring from another application
      - ./contracts/artifacts:/app/build/contracts:consistent # required if deploying/compiling contracts from within this service (if CONTRACT_ORIGIN = 'default' or 'compile')
    ports:
      - 9000:80
    environment:
      BLOCKCHAIN_HOST: 'ws://$blockchain_host'
      BLOCKCHAIN_PORT: '$blockchain_port'
      CONTRACT_ORIGIN: 'default' # Where to find the contractInstances?
      # Specify one of:
      # - 'remote' (to GET a solc-compiled contract interface json from a remote microservice); or
      # - 'mongodb' (to get a solc-compiled contract interface json from mongodb); or
      # - 'default' (to get a solc-compiled contract interface json from the app/build/ folder)
      # - 'compile' (to compile contracts from a .sol file, at startup, with solc, from the /app/contracts/ folder). Useful if the application using Timber doesn't use solc to generate contract interface json's.
    networks: # we'll have all users sharing the one tree for now. TODO: explore separation of merkle-tree db's (difficult).
      - network-buyer
      - network-supplier1
      - network-supplier2

  # The database storing the merkle tree
  mongo-merkle-tree:
    container_name: shared-merkle-mongo
    image: mongo:latest
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=admin
      - MONGO_INITDB_DATABASE=merkle_tree
    volumes:
      - ./config/merkle-tree/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
      - mongo-merkle-tree-volume:/data/db
      - ./bin/mongo_health.sh:/health-check.sh:delegated
    networks:
      - network-buyer
      - network-supplier1
      - network-supplier2
    ports:
      - 27417:27017
    healthcheck:
      test: ["CMD", "sh", "health-check.sh"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 10s

volumes:
  mongo-buyer:
  mongo-supplier1:
  mongo-supplier2:
  mongo-merkle-tree-volume:
  chaindata:

networks:
  network-geth:
    driver: bridge
    ipam:
      config:
      - subnet: 172.25.0.0/24
  network-buyer:
  network-supplier1:
  network-supplier2:
EOF

./ops/setup_circuits.sh ${BASELINE_ZKP_MODE}
