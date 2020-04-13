#!/bin/bash

# TODO: wait for all services...
./ops/await_tcp.sh -t 30 -h localhost -p 8080
