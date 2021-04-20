# ZKP Manager

> :warning: This service is still under construction. The code currently here is a foundation for future development. :warning:

The `zkp-mgr` service is a REST server written in Golang which wraps the [gnark](https://github.com/ConsenSys/gnark) zero-knowledge proof functions. A user can upload circuit source code (written in Golang using the `gnark` library), then use `zkp-mgr` to compile the code and generate/verify proofs on-demand for that circuit. Currently `goroutines` are used for the compilation and setup steps for a circuit. A future improvement might be to move that processing, in addition to proof generation and verification, to a job queue such as NATS or Kafka.

## Details

- Golang v1.15
- gin REST server

## Run

- `docker-compose up -d alice-mongo` (spin up mongodb container used by this service)
- `go mod tidy` (import go modules used by this package)
- `go run src/*.go` (build and run this package)

## Tests

The file `./tests/zkp-mgr.postman_collection.json` can be imported directly into Postman in order to manually test the REST endpoints.

`zkp-mgr` will attempt to compile any circuit that is uploaded via `POST /zkcircuits` request. The simplest circuit to use is provided in `tests/example-circuits/cubic.go`. The circuit source code file must implement the following interface:
```
package main

// Circuit input definitions
type Circuit struct

// Define declares the circuit constraints
func (circuit *Circuit) Define(curveID gurvy.ID, cs *frontend.ConstraintSystem) error
```

## ToDo

- Create dockerfile for this service
- Add support for PLONK (`zkp-mgr` assumes zkSNARK/groth16 currently)
- Add an automated test suite