#!/bin/bash

# Function to print messages with timestamps
log_message() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to run a command and log its output
run_command() {
    log_message "Running command: $1"
    eval $1
    if [ $? -ne 0 ]; then
        log_message "Error: Command failed: $1"
        exit 1
    fi
}

# Check if port 8545 is in use
EXISTING_PID=$(lsof -ti:8545)
if [ ! -z "$EXISTING_PID" ]; then
    log_message "Port 8545 is in use. Killing process $EXISTING_PID"
    kill $EXISTING_PID
fi

# Change to ccsm directory
log_message "Changing to ccsm directory"
run_command "cd ../ccsm"

# Start Hardhat node in the background
log_message "Starting Hardhat node"
run_command "npx hardhat node &"
HARDHAT_PID=$!
log_message "Hardhat node started with PID $HARDHAT_PID"

# Wait for the node to start (adjust sleep time if needed)
sleep 5

# Deploy contracts
log_message "Deploying contracts"
run_command "npx hardhat run scripts/deploy.ts"

# Change to test directory
log_message "Changing to root directory"
run_command "cd .."

# Prep database
log_message "Reset and reseed database"
run_command "npx prisma migrate reset --force"

# Run e2e tests
log_message "Running e2e tests"
run_command "npm run test:e2e"

# Stop Hardhat node
log_message "Stopping Hardhat node"
kill $HARDHAT_PID

log_message "Script execution completed"