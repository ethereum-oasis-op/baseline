FROM ubuntu:xenial

RUN apt-get update \
  && apt-get install -y wget software-properties-common \
  && rm -rf /var/lib/apt/lists/*

WORKDIR "/root"

RUN apt-get update \
  && apt-get install -y wget

# Pinning geth to version 1.9.20 as all successive geth versions dont support whisper anymore
# Refer to the release notes for 1.9.21 - https://github.com/ethereum/go-ethereum/releases/tag/v1.9.21
RUN wget https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.9.20-979fc968.tar.gz
RUN tar -xzvf geth-linux-amd64-1.9.20-979fc968.tar.gz
RUN chmod +x ./geth-linux-amd64-1.9.20-979fc968/geth
RUN mv ./geth-linux-amd64-1.9.20-979fc968/geth /usr/local/bin/
RUN rm -rf ./geth-linux-amd64-1.9.20-979fc968

ARG password
ARG privatekey
RUN echo $password > ~/.accountpassword
RUN echo $privatekey > ~/.privatekey
ADD ./genesis.json ./genesis.json
RUN geth init genesis.json
RUN geth account import --password ~/.accountpassword  ~/.privatekey

CMD exec geth --bootnodes "enode://$bootnodeId@$bootnodeIp:30301" --nodekeyhex $nodekeyhex --networkid "$networkId" --nousb --verbosity=$verbosity  --syncmode=full --mine --shh --rpc --rpcaddr "0.0.0.0" --rpcapi "eth,web3,net,admin,debug,db,shh" --gasprice "0" --etherbase $address --unlock $address --password ~/.accountpassword --allow-insecure-unlock

EXPOSE 8545
EXPOSE 30303
