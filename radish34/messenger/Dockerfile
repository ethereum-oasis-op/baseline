FROM node:12-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install packages
RUN npm install

# Bundle app source
# See ignore for exclusions
COPY . .

EXPOSE 4001

CMD [ "npm", "start" ]
