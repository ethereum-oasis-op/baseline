FROM node:11.15

RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci --no-save

EXPOSE 3000
CMD npm start