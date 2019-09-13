FROM node:10.16-alpine

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 4000

CMD [ "npm", "start"]