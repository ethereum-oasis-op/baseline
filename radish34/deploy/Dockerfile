FROM node:13.3

RUN \
  apt-get update -y && \
  apt-get install python3-pip -y && \
  pip3 install bitstring==3.1.5

RUN mkdir /app
WORKDIR /app

COPY deploy.sh ./deploy.sh
COPY ./package.json ./package-lock.json ./
RUN \
  npm ci && \
  git clone https://github.com/Zokrates/pycrypto.git

CMD npm run deploy
