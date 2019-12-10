FROM node:10.15

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install packages
RUN npm install

# Bundle app source
COPY . .

EXPOSE 4001

CMD [ "npm", "start" ]