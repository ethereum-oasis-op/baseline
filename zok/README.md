## How to use the zok service

Run the following instruction to ensure that the service is up:

`docker-compose up -d radish-zok`

This should spin up two containers: `radish-zok` and `radish-zok-watch`; wherein `radish-zok` contains RESTful end points for interacting with the service. And `radish-zok-watch` runs in the background to ensure that the js files in the former container are appropriately compiled using babel.

Logs should look like the following:

`radish-zok`: `docker-compose logs -f radish-zok`
```
radish34-zokrates@1.0.0 dev /app
radish-zok_1            | > nodemon ./dist/index.js
radish-zok_1            | 
radish-zok_1            | [nodemon] 1.19.4
radish-zok_1            | [nodemon] to restart at any time, enter `rs`
radish-zok_1            | [nodemon] watching dir(s): *.*
radish-zok_1            | [nodemon] watching extensions: js,mjs,json
radish-zok_1            | [nodemon] starting `node ./dist/index.js`

```

`radish-zok-watch`: `docker-compose logs -f radish-zok-watch`

```
radish34-zokrates@1.0.0 build:watch /app
radish-zok-watch_1      | > npm run build -- --watch
radish-zok-watch_1      | 
radish-zok-watch_1      | 
radish-zok-watch_1      | > radish34-zokrates@1.0.0 build /app
radish-zok-watch_1      | > cod-scripts build "--watch"
radish-zok-watch_1      | 
radish-zok-watch_1      | Successfully compiled 6 files with Babel.
```

`radish-zok` service is a RESTful service that makes use of `@eyblockchian/zokrates.js` package, and has the following end points. To be able to leverage the service, place the `.code` file(s) at `zok/code`, and run each of the instructions below per file. This service can be called from other containers using `http://radish-zok.docker` or expose a port in the `docker-compose.yml` (for example 8080, as in this case: replace with `http://localhost:8080` to run the below curl commands locally)

`generateKeys`: This is a POST instruction that runs composite instructions, that takes in a request body of `name`, for the name of the `.code` file, and runs `compile`, `setup` and `exportVerifier` instructions. The `zok/output` has the outputs of these steps copied from within the container. Replace `test` with the name of the file to be computed

Example: `curl -d '{"name": "test}' -H "Content-Type: application/json" -X POST http://radish-zok.docker/generate-keys`

`generateProof`: This is a POST instruction that runs composite instructions, that takes in a request body of `name`, for the name of the `.code` file, and the witness arguments and thereafter, runs `compute-witness` instructions. The `zok/output` has the outputs of these steps copied from within the container. Replace `test` with the name of the file to be computed. Subsequently, the `generate-proof` is run to produce the corresponding `proof.json` in the `/output`.

Example: `curl -d '{"name": "test", "witness": "[5, 5]"}' -H "Content-Type: application/json" -X POST http://radish-zok.docker/generate-proof`

Alternately, POSTMAN application can be used to run these curl requests.

Note: All the resultant files from the above steps/processes are created in a sub-directory named with the input parameter, `name`.

# ZoKrates circuits

## Requirements
Install `cargo` by `curl https://sh.rustup.rs -sSf | sh`

## build
```
./do build
```

## example
```
cat examples/square.code > root.code
./do compile
./do setup
./do witness 3 9 
./do generate
```
