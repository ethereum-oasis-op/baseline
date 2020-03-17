cwd=$(pwd)

# absolute paths to all modules
api=$(cwd)/api
deploy=$(cwd)/deploy
messenger=$(cwd)/messenger
ui=$(cwd)/ui
zkp=$(cwd)/zkp
zok=$(cwd)/zok

# Makefile

.PHONY: build clean contracts deploy-contracts npm-install start stop test zk-circuits

default: build

build: npm-install contracts
	docker-compose build
	make zk-circuits

clean: stop
	docker container prune -f
	docker network prune -f
	
	rm -rf artifacts/
	rm -rf build/
	rm -rf dist/
	rm -rf node_modules/

	rm -rf ${api}/node_modules/
	rm -rf ${deploy}/node_modules/
	rm -rf ${messenger}/node_modules/
	rm -rf ${ui}/node_modules/
	rm -rf ${zkp}/node_modules/
	rm -rf ${zok}/node_modules/

contracts:
	npm run build

deploy-contracts:
	npm run deploy

npm-install:
	npm ci && npm run postinstall

start:
	docker-compose up -d

stop:
	docker-compose down

test:
	npm run test

zk-circuits:
	npm run setup
