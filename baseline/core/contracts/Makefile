.PHONY: abi clean compile flat test coverage

default: compile

abi: clean compile
	node ./src/abi.js

clean:
	rm -rf build/
	rm -rf flat/
	rm -rf tmp/

compile:
	node_modules/.bin/truffle compile

coverage:
	node_modules/.bin/solidity-coverage

flat:
	rm -rf tmp/
	mkdir tmp

	mkdir -p build/flat
	rm build/flat/* 2&>/dev/null || true

	cp contracts/*.sol tmp/
	rm tmp/Migrations.sol

	sed -i '' -e "s/\(import \)\(.*\)\/\(.*\).sol/import \".\/\3.sol/g" tmp/*
	node_modules/.bin/truffle-flattener tmp/* | sed "1s/.*/pragma solidity ^0.5.8;/" > build/flat/Baseline.sol

	rm -rf tmp/

test:
	node_modules/.bin/truffle test
