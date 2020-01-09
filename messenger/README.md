# Messenger Service

This service sends and receives messages using Whisper identities. `messenger` connects to a running, Whisper-enabled geth client via websocket.

# Testing

## API, Unit Testing
1. Make sure you have all of the necessary npm packages in `./node_modules`
```
npm install
```
2. Build the ancillary services needed to run unit tests and test the REST API.
```
docker-compose -f ../docker-compose.yml up --build geth-bootnode geth-miner1 geth-miner2 geth-node mongo-buyer
```
3. Start the messenger service in the `test` env
```
npm run start:test
```
4. Run the tests
```
npm test
```

## Troubleshooting

If you get errors related to a `node_module` called `scrypt` please ensure that you are running node version `10.15`. The `nvm` (node version manager) tool allows you to easily switch between versions:
```
nvm install 10.15
nvm use 10.15
```
