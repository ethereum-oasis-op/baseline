FROM node:11.15

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN git config --global url."https://".insteadOf git://

RUN npm ci

ENTRYPOINT ["npm", "run"]
