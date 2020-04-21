# Makefile

# relative path to the construction site
radish34=./radish34

# over time, as the radish34 use-case is abstracted/generalized into
# the baseline protocol, the cd/cd .. hacks will fade away...

.PHONY: build build-containers clean contracts deploy-contracts install-config npm-install start stop system-check reset restart test zk-circuits

default: build

build: npm-install contracts

build-containers: build
	cd ${radish34} && \
	npm run dockerize:ubuntu && \
	cd ..

clean: stop
	@$(radish34)/../bin/clean_npm.sh

contracts:
	cd ${radish34} && \
	npm run build:contracts:ubuntu && \
	cd ..

deploy-contracts: install-config
	cd ${radish34} && \
	npm run deploy && \
	cd ..

install-config:
	cd ${radish34} && \
	npm run install-config && \
	cd ..

npm-install:
	cd ${radish34} && \
	npm run build:ubuntu && \
	cd ..

start: system-check install-config build-containers
	cd ${radish34} && \
	npm run setup-circuits && \
	npm run deploy && \
	docker-compose up -d api-buyer api-supplier1 api-supplier2 ui && \
	cd ..

stop:
	cd ${radish34} && \
	docker-compose down --remove-orphans && \
	docker network rm \
		radish34_network-buyer \
		radish34_network-supplier1 \
		radish34_network-supplier2 \
		radish34_geth || true && \
	docker volume rm radish34_mongo-merkle-tree-volume || true && \
	cd ..

system-check:
	@npm run --silent system-check

reset: stop
	cd ${radish34} && \
	docker container prune -f && \
	docker volume rm \
		radish34_mongo-buyer \
		radish34_mongo-supplier1 \
		radish34_mongo-supplier2 \
		radish34_mongo-merkle-tree-volume \
		radish34_chaindata || true && \
	docker image rm \
		radish34_api-buyer \
		radish34_api-supplier1 \
		radish34_api-supplier2 \
		radish34_deploy \
		radish34_messenger-buyer \
		radish34_messenger-supplier1 \
		radish34_messenger-supplier2 || true && \
	rm -rf ./config && \
	rm -rf ./zkp/output && \
	cd ..

restart: stop start

test:
	cd ${radish34} && \
	npm run await-stack && \
	npm run test && \
	npm run postman-test-zkp-api && \
	npm run postman-integration-test && \
	cd ..

zk-circuits:
	cd ${radish34} && \
	rm -rf ./zkp/output && \
	mkdir -p ./zkp/output && \
	npm run setup-circuits && \
	cd ..
