#!/bin/sh
mongo radish34 --host mongo-buyer --eval "printjson(db.dropDatabase())"
cd collections && ls *.json | while read col; do mongoimport --host mongo-buyer --db radish34 --file $col --jsonArray; done
