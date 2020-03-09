FROM ubuntu:xenial

RUN apt-get update \
  && apt-get install -y wget software-properties-common \
  && rm -rf /var/lib/apt/lists/*

WORKDIR "/root"

RUN add-apt-repository -y ppa:ethereum/ethereum

ARG binary
RUN apt-get update \
  && apt-get install -y ethereum

ARG password
ARG privatekey
RUN echo $password > ~/.accountpassword
RUN echo $privatekey > ~/.privatekey
ADD ./genesis.json ./genesis.json
ADD ./static-nodes.json ./.ethereum/geth/static-nodes.json
RUN geth init genesis.json
RUN geth account import --password ~/.accountpassword ~/.privatekey

CMD exec geth --bootnodes "enode://$bootnodeId@$bootnodeIp:30301" --networkid "$networkId" --nousb --verbosity=$verbosity --ws --wsport 8546 --wsaddr "0.0.0.0" --wsorigins="*" --wsapi=web3,shh,net,admin --rpc --rpcaddr "0.0.0.0" --rpcapi "eth,web3,net,admin,debug,db,shh" --rpccorsdomain "*" --syncmode="$nodeType" --etherbase $address --unlock $address --password ~/.accountpassword --allow-insecure-unlock --shh

EXPOSE 8545
EXPOSE 8546
EXPOSE 30303
