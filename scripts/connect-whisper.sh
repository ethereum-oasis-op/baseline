#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Number of whisper connections not supplied. Defaulting to three."
    count=3
fi

for (( node_num=1; node_num<=$count; node_num++))
do
  ttab -G -t "Whisper Node $node_num" exec node ../whisper/src/index.js $node_num
done
