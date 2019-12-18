#!/bin/sh
mongo radish34 --host mongo-$ROLE --eval "printjson(db.dropDatabase())"
cd collections && ls *.json | while read col; do mongoimport --host mongo-$ROLE --db radish34 --file $col --jsonArray; done
