#!/bin/bash

if [ $# -lt 2 ]
  then
    echo "Number of whisper connections not supplied. Defaulting to two."
    count=2
  else
    count=$2
fi

if [[ $1 != "test" && $1 != "dev" ]]
  then
    echo "Node environment not given. Defaulting to development"
    environment="development"
  else
    environment=$1
fi

for (( node_num=1; node_num<=$count; node_num++))
do
  # Set MONGODB_URL environment variable so that each node has its own database within the same local Mongo
  ttab -G -t "Whisper Node $node_num" exec env NODE_ENV=$environment node ../backend/app.js $node_num
done
