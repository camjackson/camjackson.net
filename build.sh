#!/bin/sh

set -e

echo
echo ' ------------------------------- '
echo '| Clearing old target directory |'
echo ' ------------------------------- '
echo

rm -rf target
echo 'Done!'

echo
echo ' ----------------- '
echo '| Compiling views |'
echo ' ----------------- '
echo

./node_modules/.bin/babel-node src/buildSite.js
echo 'Done!'

echo
echo ' ----------------------- '
echo '| Copying static assets |'
echo ' ----------------------- '
echo

cp -R public/* target/
echo 'Done!'

echo
