#!/bin/sh

echo 'This is probably dead now, do not use'
exit 1

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

npm run build
echo 'Done!'

echo
echo ' ----------------- '
echo '| Uploading to S3 |'
echo ' ----------------- '
echo

aws s3 cp target/index   s3://camjackson.net      --content-type 'text/html' --region us-east-1
aws s3 cp target/archive s3://camjackson.net      --content-type 'text/html' --region us-east-1
aws s3 cp target/post    s3://camjackson.net/post --content-type 'text/html' --region us-east-1 --recursive --exclude .DS_Store

aws s3 cp target/atom.xml s3://camjackson.net --content-type 'application/xml' --region us-east-1

aws s3 cp public s3://camjackson.net --region us-east-1 --recursive --exclude .DS_Store
