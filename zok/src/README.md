# How to use the zok service

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

`radish-zok` service is a RESTful service that makes use of `@eyblockchian/zokrates.js` package, and has the following end points. To be able to leverage the service, place the `.zok` file(s) at `/app/zok/path/to/parent-dir/file.zok`, and run each of the instructions below per file. This service can be called from other containers using `http://radish-zok.docker` or expose a port in the `docker-compose.yml` (for example 8080, as in this case: replace with `http://localhost:8080` to run the below curl commands locally)

### `generateKeys`
This is a POST instruction that runs `compile`, `setup` and `exportVerifier` instructions.

Request body:
`filepath`: the path of the `.zok` file (relative to `/app/zok/`).
E.g. for a file at `/app/zok/path/to/test.zok` the filepath is `path/to/test.zok`.

The `/app/zok/output` dir will contain the outputs of these steps copied from within the container.

Example: (Replace `path/to/test.zok` with the filepath of the file to be computed).  
`curl -d '{"filepath": "path/to/test.zok"}' -H "Content-Type: application/json" -X POST http://radish-zok.docker/generate-keys`

### `generateProof`
This is a POST instruction that runs `compute-witness` and `generate-proof` instructions.

Request body:  
`filename`: the name of the `.zok` file (without the `.zok` file extension)
`witness`: array of the witness arguments  

The `/app/zok/output` dir has the outputs of these steps copied from within the container. When the `generate-proof` instruction is run, the corresponding `proof.json` is stored in the `/app/zok/output` dir.  

Example: (Replace `filename` with the name of the file for which we're creating a witness).  
`curl -d '{"filename": "test", "witness": [5, 25]}' -H "Content-Type: application/json" -X POST http://radish-zok.docker/generate-proof`

Alternatively, the POSTMAN application can be used to run these curl requests.

Note: All the resultant files from the above steps/processes are created in a sub-directory named with the input parameter, `filename` (where, for example, the filename is `test` for filepath `/app/zok/path/to/test.zok`).


# testing individual `.zok` files

## a) using the `./do` shell scripts

### Requirements
Cargo is pre-installed on the container. Following instructions are for development utilities to run quick commands from terminal/console.

### build

This instruction builds cargo to be able to run native instructions: `docker-compose exec radish-zok cd src && ./do build`

Following examples can be run, or custom written as scripts that could be mounted to the container to run one-off instructions.

```
cat path/to/<filename>.zok > test.zok
./do compile
./do setup
./do witness 3 9
./do generate
```

## b) mounting to zokrates in the terminal

To test a particular `.zok` file manually in the terminal:

(You might need to do `docker pull zokrates/zokrates:0.5.1` if you haven't already).

`cd path/to/parent-dir-of-zok-file/`

`docker run -v $PWD:/home/zokrates/code -ti zokrates/zokrates:0.5.1 /bin/bash` (mounting to `/code` ensures the outputs from zokrates don't overwrite / mix with our local machine's files).

`./zokrates compile -i code/<filename>.zok`

`./zokrates setup`

`./zokrates compute-witness -a <witness>`

`./zokrates generate-proof`
