# Makefile

SHELL:=/bin/bash

# relative path to the construction site
radish34=./

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
	@$(radish34)/ops/clean_npm.sh

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

dev-env:
	@pushd ${radish34} && \
	./ops/dockerCompose_dev.sh && \
	popd

prod-env:
	@pushd ${radish34} && \
	./ops/dockerCompose_prod.sh && \
	popd

start: start-dev

start-dev:
	@pushd ${radish34} && \
	npm run start:dev && \
	popd

start-prod:
	@pushd ${radish34} && \
	npm run start:prod && \
	popd

stop:
	@pushd ${radish34} && \
	npm run stop && \
	popd

system-check:
	@pushd ${radish34} && \
	npm run --silent system-check && \
	popd

reset:
	@pushd ${radish34} && \
	npm run restart && \
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
	npm run setup-circuits ${mode} && \
	popd
