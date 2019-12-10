## How to use the zok service

Entrypoint script is included as part of the build image. Run the following instruction for usage:

`docker-compose run --rm zok help`

There are individual commands to substitute for 'help' above: `all, compile, compute-witness, export-verifier, generate-proof, output, setup`.

`all`: Runs all steps in sequence for compiling code, to proof generation and storing results to a local dir.

Example: `docker-compose run --rm zok all`

`compile`: Runs Zokrates built-in compiler to compile the code in a local dir (`/home/zokrates/zok_code` or `/home/zokrates/examples`) to saves the output files within the container. Takes in a single argument which is the path to the local code file.

Example: `docker-compose run --rm zok compile /examples/factorization.code`

`compute-witness`: Runs witness generation and saves outputs locally within the container.

Example: `docker-compose run --rm zok compute-witness 6 2 3`

`export-verifier, generate-proof, setup`: These comamnds execute the trusted set up, generation of proofs, and exporting verifier code as output locally within the container.

`output`: Moves the files on the root dir of the container to a mountable `/home/zokrates/output` within the container.

Example: `docker-compose run --rm zok output`

Note that each of the above commands except for `all`, would only result in partial outputs, and would need to be run sequentially either by running the container in -d mode appending something like `&& tail -f /dev/null` to the entrypoint arguments.
