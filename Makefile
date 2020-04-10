# Makefile

# absolute path to the construction site
radish34=./radish34

# over time, as the radish34 use-case is abstracted/generalized into
# the baseline protocol, the pushd/popd hacks will fade away...

.PHONY: build clean contracts deploy-contracts npm-install start stop reset test zk-circuits

default: build

build: npm-install contracts
	pushd ${radish34} && \
	docker-compose build && \
	npm run setup && \
	popd

clean: stop
	$(radish34)/../bin/clean_npm.sh

contracts:
	pushd ${radish34} && \
	npm run build:contracts && \
	popd

deploy-contracts:
	pushd ${radish34} && \
	npm run deploy && \
	popd

npm-install:
	pushd ${radish34} && \
	npm ci && npm run postinstall && \
	popd

start:
	pushd ${radish34} && \
	docker-compose up -d && \
	popd

start-with-splunk:
	pushd ${radish34} && \
	docker-compose -f docker-compose-splunk.yml up -d && \
	echo "Patiently waiting 75 seconds for splunk container to init ..." && \
	sleep 75 && \
	npm run deploy && \
	docker-compose -f docker-compose-with-splunk.yml up -d && \
	docker-compose -f docker-compose-ethlogger.yml up -d && \
	popd

start-ethlogger:
	pushd ${radish34} && \
	docker-compose -f docker-compose-ethlogger.yml up -d && \
	popd

stop:
	pushd ${radish34} && \
	docker-compose down && \
	popd

stop-ethlogger:
	pushd ${radish34} && \
	docker-compose -f docker-compose-ethlogger.yml down && \
	popd

stop-splunk:
	pushd ${radish34} && \
	docker-compose -f docker-compose-splunk.yml down && \
	popd

reset:
	pushd ${radish34} && \
	docker-compose down && \
	docker container prune -f && \
	docker volume rm radish34_mongo-buyer radish34_mongo-supplier1 radish34_mongo-supplier2 radish34_mongo-merkle-tree-volume radish34_chaindata && \
	docker network rm radish34_network-buyer radish34_network-supplier1 radish34_network-supplier2 radish34_geth && \
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

test:
	pushd ${radish34} && \
	npm run test && \
	popd

zk-circuits:
	pushd ${radish34} && \
	npm run setup && \
	popd
