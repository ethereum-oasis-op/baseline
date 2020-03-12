FROM node:13.3

RUN mkdir /app
WORKDIR /app

COPY deploy.sh ./deploy.sh
COPY ./package.json ./package-lock.json ./
RUN npm ci

CMD npm run check
