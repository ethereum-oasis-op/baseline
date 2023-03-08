# NATS configuration

We are relying on simple user authorization for NATS. Each BpiSubject is represented with a single user in Nats. Each Nats user is authorized for specific topics through the permissions map in the Nats server config file. Currently, we assume that the Bpi Admin will manage these users and their permissions. [Link](    https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro) to Nats docs.

NATS config that can be used in the development environment can be found in here *./example-nats-server.conf*

[More](https://github.com/nats-io/nats-server/tree/main/server/configs) NATS sample configurations.

## Authorization flow

1) On server initialization, BPI operator will create a main BPI user with a password and add it to server configuration. Examples can be found in *./example-nats-server.conf* file, bpi_operator user.

2) bpi_operator is the user through which BPI will auth to NATS on startup

3) bpi_operator has the right to publish and subscribe to channel

4) For each new BpiSubject, a username/password pair is added to the Nats server configuration by the admin. Username is the public key of the BpiSubject and password can be randomly generated.

5) Admin will communicate the pass to the BpiSubject and it is the responsibility of the BpiSubject to store it safely and use it for connecting to the NATS server

6) Bpi Subject can:
        - Publish on the general channel 
        - Subscribe only to it's PK own channel 
    
7) This part of adding the BpiSubject to server config might be later automated through the usage of shell and signal reload command.

## Running the server in Docker

To run the server:
`docker run -p 4222:4222 -d nats:alpine`- Alpine image is needed because of sh access to the container.

To sh into the server: `docker exec -it <nats_container_id> /bin/sh`

To change nats server configuration in the container: `vi /etc/nats/nats-server.conf`

To reload the server with new config: `nats-server --signal reload`


## Installing NATS cli in Docker

1. [Download](https://github.com/nats-io/natscli/releases/download/v0.0.35/nats-0.0.35-amd64.deb) Nats cli for Linux

2. sh into the running container

3. docker cp <download_location>/nats-0.0.35-amd64.deb <nats_container_id>:/var/tmp/

4. apk add dpkg

5. dpkg -i --force architecture /var/tmp/nats-0.0.35-amd64.deb

## Password management

Passwords can be either stored in plain text or in bcrypted format. Both approaches are shown in the *./example-nats-server.conf*. In order to generate a bcrypt hash of the password, you need to utilize the nats cli
`nats server passwd` command. [Link](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/username_password) to NATS docs.

## Trying out NATS messaging


Run the following commands in the terminal: 
```bash

$ nats context add local --description "Localhost" # adds localhost server to nats cli

$ nats --user <username> --password <password> pub general "<message>" # publishes new message on the general subject. Assumes two bpi subjects are added to the db with proper PKs.
# Example message format: "{ \"id\": \"0a3dd67c-c031-4b50-95df-0bc5fc1c78b5\", \"fromBpiSubjectId\": \"71302cec-0a38-469a-a4e5-f58bdfc4ab32\", \"toBpiSubjectId\": \"76cdd901-d87d-4c87-b572-155afe45c128\", \"content\": { \"testProp\":\"testValue\" }, \"signature\": \"0x69c0237bf86c34df000d04b0c1cc1ed037cb3910e2bc8fbef5b01628317f625d70bf83aba5ee5963b2e9e68b3074f61503d3b7ffb2b6caff7e447e7253089b1c1c\", \"type\": 0}"

```
Observe the log messages in the terminal where the app is running.



