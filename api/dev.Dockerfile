FROM node:11.13

RUN \
apt-get update -y && \
apt-get install python3-pip -y && \
pip3 install bitstring==3.1.5

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

EXPOSE 8001
EXPOSE 8101

CMD npm start
