FROM radish34_logger as logger
FROM node:12.16

RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++

ENV FORCE_COLOR=1

RUN mkdir /logger
WORKDIR /logger

COPY --from=logger /logger/dist ./dist
COPY --from=logger /logger/package.json /logger/package-lock.json /logger/.babelrc ./
RUN npm ci

RUN mkdir ../app
WORKDIR ../app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install packages
RUN npm ci

# Bundle app source
# See ignore for exclusions
COPY . .

EXPOSE 4001

CMD [ "npm", "start" ]
