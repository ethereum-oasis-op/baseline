#!/bin/bash

# Simple bash script to wait for the stack to report healthy.
# Use it like this: $> ./ops/await_stack.sh
# Accepts no arguments
#
# Other things to note: 
# - It only looks for services that match the name filters
# - It determines "healthy" status by getting a list of status strings from the services, removing the strings that match "healthy"
# and then seeing if there's any characters left. Not super elegant but it works (as long as docker doesn't change how it reports status, 
# or if it reports status in a lanugage other than engilsh.)
# - It will throw a docker error if you run this while the stack is coming down. But this is an edge case and out of scope

set -euo pipefail

trap 'catch $? $LINENO' ERR

# Catching so we can handle errors in the function calls
catch() {
  echo "Error $1 occurred on $2"
  exit 1
}

NAME_FILTERS='api|messenger|zkp|ganache|radish34-ui'

# Returns 1 if any services in the service list are NOT are healthy, returns 0 if they all are healthly
all_services_healthy () {
  # Get the service ID's and turn them from a vertical list to a horizonal one
  service_list=`docker ps -a -q --filter="name=$NAME_FILTERS" | tr '\n' ' '`
  # Inspecting the health of the SERVICE_LIST service IDs and then filtering the results.
  # Anything 'unhealthy' or 'starting' leave characters behind after the `tr -d` filter
  # Note: On osx it appears `wc -m` returns spaces before the numerical output (eg. [      9]). This is why there is a terminating `tr -d ' '`` 
  unhealthy_count=$(docker inspect --format "{{json .State.Health.Status }}" $service_list | tr -d '"healthy \n' | wc -m | tr -d ' ')
  
  if [ $((unhealthy_count)) -gt 0 ]; then
    return 1
  fi
  return 0
}

# Check if we actually have services to monitor, none may be running.
if [ $(docker ps -a -q --filter="name=$NAME_FILTERS" | tr '\n' ' ' | wc -m | tr -d ' ') -gt 1 ]; then
  MAX_WAIT=30
  WAIT_COUNT=0
  printf "Polling stack health..."
  until [ $WAIT_COUNT -eq $MAX_WAIT ] || all_services_healthy; do
    printf '.'
    sleep 2
    ((WAIT_COUNT+=1))
  done
  if [ $WAIT_COUNT -eq $MAX_WAIT ]; then
    echo 'Error: Stack wait timeout reached!'
    exit 1
  fi
  echo "All services reporting 'healthy'"
else 
  echo "No services appear to be running. Are they?"
  exit 1
fi
