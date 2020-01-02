FROM node:11.13

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

EXPOSE 8001
EXPOSE 8101

CMD npm start
