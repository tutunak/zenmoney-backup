#!/bin/bash

BASEDIR=`dirname "$0"`
FULLPATH=`cd "$BASEDIR"; pwd`
cd $FULLPATH

docker run --rm \
-v /etc/localtime:/etc/localtime:ro \
-v /home/backup/zenmoney:/app/export \
-v $FULLPATH/zenmoney.json:/app/zenmoney.json \
tagplus5/zenmoney-backup
