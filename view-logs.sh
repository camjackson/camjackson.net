#!/usr/bin/env bash
set -e
set -x

BUCKET='cloudwatch-logs-camjackson.net'
CWD=$(pwd)

aws s3 sync --region us-east-1 s3://$BUCKET .
cat *.gz > combined.log.gz
find $CWD ! -name 'combined.log.gz' -name '*.gz' -type f -exec rm -f {} +
gzip -d combined.log.gz
sed -i '/^#/ d' combined.log
exit 0
