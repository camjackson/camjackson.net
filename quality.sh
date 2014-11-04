#!/bin/bash

if grep -rHn --color --exclude-dir node_modules --exclude quality.sh --exclude gulpfile.js 'console.log'
then
  echo "Quality check failed: there are console.logs"
  exit 1
fi

if grep -rHn --color --exclude-dir node_modules --exclude quality.sh '//TODO'
then
  echo "Quality check failed: there are TODOs."
  exit 1
fi

exit 0
