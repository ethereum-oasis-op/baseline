#!/bin/bash

(pushd messenger && npm ci && popd); (pushd api && npm ci && popd); (pushd deploy && npm ci && popd); (pushd ui && npm ci && popd); (pushd zkp && npm ci && popd); (pushd contracts && npm ci && popd)
