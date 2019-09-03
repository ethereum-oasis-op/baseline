#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Number of whisper connections not supplied. Defaulting to one."
    count=1
fi

for (( node_num=1; node_num<=$count; node_num++))
do
  node ./whisper/src/index.js $node_num
done