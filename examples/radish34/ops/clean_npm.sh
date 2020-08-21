#!/bin/bash

echo "Found the following... "
find . -name "node_modules" -type d -prune -print | xargs du -chs

echo "Removing them... "
find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;

echo "Done!"
