#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Number of whisper connections not supplied. Defaulting to three."
    count=3
  else
    count=$1
fi

for (( node_num=1; node_num<=$count; node_num++))
do
  # Set MONGODB_URL environment variable so that each node has its own database within the same local Mongo
  ttab -G -t "Whisper Node $node_num" exec env MONGODB_URL="mongodb://127.0.0.1:27017/radish34_$node_num" node ../whisper/app.js $node_num
done
