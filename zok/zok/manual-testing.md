To test a particular `.zok` file:

`cd path/to/parent-dir/`

`docker run -v $PWD:/home/zokrates/code -ti zokrates/zokrates:0.5.1 /bin/bash` (mounting to `/code` ensures the outputs from zokrates don't overwrite / mix with our local machine's files).

`./zokrates compile -i code/<filename>.zok`

`./zokrates setup`

`./zokrates compute-witness -a <witness>`

`./zokrates generate-proof`

`./zokrates export-verifier`
