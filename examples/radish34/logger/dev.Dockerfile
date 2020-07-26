FROM node:11.15

ENV FORCE_COLOR=1

RUN mkdir /logger
WORKDIR /logger

COPY ./package.json ./package-lock.json ./.babelrc ./
RUN npm ci

COPY ./src ./src

RUN npm start
