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
RUN geth init genesis.json
RUN geth account import --password ~/.accountpassword  ~/.privatekey

ENV address=""
ENV bootnodeId=""
ENV bootnodeIp=""

CMD exec geth --bootnodes "enode://$bootnodeId@$bootnodeIp:30301" --networkid "6660001" --verbosity=4 --ws --wsport 8546 --wsaddr "0.0.0.0" --wsorigins="*" --wsapi=web3,shh,net,admin --rpc --rpcaddr "0.0.0.0" --rpcapi "eth,web3,net,admin,debug,db,shh" --rpccorsdomain "*" --syncmode="full" --shh

EXPOSE 8545
EXPOSE 8546
EXPOSE 30303