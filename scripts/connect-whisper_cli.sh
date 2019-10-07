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
  ttab -G -t "Whisper Node $node_num" exec node ../whisper/src/blessed/index.js $node_num
done
