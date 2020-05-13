# Makefile

SHELL:=/bin/bash

# relative path to the construction site
radish34=./radish34

# over time, as the radish34 use-case is abstracted/generalized into
# the baseline protocol, the pushd/popd hacks will fade away...

.PHONY: build build-containers clean contracts deploy-contracts install-config npm-install start stop system-check reset restart test zk-circuits

default: build

build: npm-install contracts

build-containers: build
	@pushd ${radish34} && \
	npm run dockerize && \
	popd

clean: stop
	@$(radish34)/../bin/clean_npm.sh

contracts:
	@pushd ${radish34} && \
	npm run build:contracts && \
	popd

deploy-contracts: install-config
	@pushd ${radish34} && \
	npm run deploy && \
	popd

install-config:
	@pushd ${radish34} && \
	npm run install-config && \
	popd

npm-install:
	@pushd ${radish34} && \
	npm run build && \
	popd

start: system-check install-config build-containers
	@pushd ${radish34} && \
	npm run setup-circuits && \
	npm run deploy && \
	docker-compose up -d api-buyer api-supplier1 api-supplier2 ui && \
	popd

start-with-splunk: system-check install-config build-containers
	@pushd ${radish34} && \
	docker-compose -f docker-compose-splunk.yml up -d && \
	echo "Patiently waiting 75 seconds for splunk container to init ..." && \
	sleep 75 && \
	npm run setup-circuits && \
	npm run deploy && \
	docker-compose up -f docker-compose-with-splunk.yml -d api-buyer api-supplier1 api-supplier2 ui && \
	popd

start-ethlogger:
	pushd ${radish34} && \
	docker-compose -f docker-compose-ethlogger.yml up -d && \
	popd

stop:
	@pushd ${radish34} && \
	docker-compose down --remove-orphans && \
	docker network rm \
		radish34_network-buyer \
		radish34_network-supplier1 \
		radish34_network-supplier2 \
		radish34_geth || true && \
	docker volume rm radish34_mongo-merkle-tree-volume || true && \
	popd

stop-ethlogger:
	pushd ${radish34} && \
	docker-compose -f docker-compose-ethlogger.yml down && \
	popd

stop-splunk:
	pushd ${radish34} && \
	docker-compose -f docker-compose-splunk.yml down && \
	popd

system-check:
	@npm run --silent system-check

reset: stop
	@pushd ${radish34} && \
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
	popd

reset-splunk:
	pushd ${radish34} && \
	set +e docker-compose -f docker-compose-ethlogger.yml down && \
	set +e docker-compose -f docker-compose-splunk.yml down && \
	docker-compose -f docker-compose-with-splunk.yml down && \
	docker container prune -f && \
	docker volume rm radish34_mongo-buyer radish34_mongo-supplier1 radish34_mongo-supplier2 radish34_mongo-merkle-tree-volume radish34_chaindata && \
	rm splunk/checkpoints.json && \
	popd

restart: stop start

test:
	@pushd ${radish34} && \
	npm run await-stack && \
	npm run test && \
	popd

zk-circuits:
	@pushd ${radish34} && \
	rm -rf ./zkp/output && \
	mkdir -p ./zkp/output && \
	npm run setup-circuits && \
	popd
