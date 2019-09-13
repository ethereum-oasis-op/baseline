FROM node:11.13

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

EXPOSE 80
CMD npm start
