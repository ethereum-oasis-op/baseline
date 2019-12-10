# Testing backend code

## Command description
1. Navigate to `/scripts` directory
2. Startup the local test geth environment
3. Launch the API server and connect to the Whisper clients in the running geth nodes
4. Navigate to `/messenger` directory
5. Kickoff the tests

## Command execution
```
cd <repo_root>/scripts
./geth-full-nodes.sh
./connect-whisper.sh test
cd ../messenger
npm test
```