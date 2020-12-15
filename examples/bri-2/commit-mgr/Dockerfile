FROM node:12.16-alpine AS build

WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# Install packages
RUN npm ci

# Bundle app source
# See ignore for exclusions
COPY . .
RUN npm run tsc
RUN npm ci --production

FROM alpine:3
RUN apk add nodejs --no-cache
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Start
CMD [ "node", "./dist/index.js" ]
EXPOSE 4001
