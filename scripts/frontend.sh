 #!/bin/bash

docker-compose -f ../docker-compose.yml up --build sol-compile jest ganache zok radish34-ui radish-api radish-api-watch mongo mongo-seed
