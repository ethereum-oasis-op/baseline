FROM node:11.15

RUN mkdir /logger
WORKDIR /logger

COPY ./package.json ./package-lock.json ./.babelrc ./
RUN npm ci

COPY ./src ./src

RUN npm start
