FROM radish34_logger as logger
FROM node:13.3

RUN \
  apt-get update -y && \
  apt-get install python3-pip -y && \
  pip3 install bitstring==3.1.5

ENV FORCE_COLOR=1

RUN mkdir /logger
WORKDIR /logger

COPY --from=logger /logger/dist ./dist
COPY --from=logger /logger/package.json /logger/package-lock.json /logger/.babelrc ./
RUN npm ci

RUN mkdir ../app
WORKDIR ../app

COPY deploy.sh ./deploy.sh
COPY ./package.json ./package-lock.json ./paths-contracts.json ./
RUN \
  npm ci && \
  git clone https://github.com/Zokrates/pycrypto.git

CMD npm run deploy
