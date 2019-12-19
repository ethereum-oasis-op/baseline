# Messenger Service

# Installing


# Running

# Testing

## Integration

## API, Unit Testing
1. Make sure you have all of the necessary npm packages in `./node_modules`
```
npm install
```
2. Build the ancillary services needed to run unit tests and test the REST API.
```
docker-compose up --build
```
3. Start the messenger service in the `test` env
```
npm run start:test
```
4. Run the tests
```
npm test
```
