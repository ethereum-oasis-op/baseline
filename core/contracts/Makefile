.PHONY: abi clean compile flat test coverage

default: compile

abi: clean compile
	node ./src/abi.js

clean:
	rm -rf artifacts/

compile:
	node_modules/.bin/truffle compile

coverage:
	node_modules/.bin/solidity-coverage

flat:
	node_modules/.bin/truffle-flattener contracts/*

test:
	npm test
