#!/bin/bash

if [ ! -e ${SNAP_CACHE_DIR}/docker/docker.rpm ]; then
   echo Docker is not in snap cache dir. Need to download it.

   #Make sure there's only one rpm to copy to cache later
   rm -f /var/cache/yum/docker-io/packages/*

   sudo yum -y install docker-io

   echo Copying rpm to snap cache dir for next time.
   mkdir ${SNAP_CACHE_DIR}/docker
   mv `find /var/cache/yum/docker-io/packages -name docker*.rpm` ${SNAP_CACHE_DIR}/docker/docker.rpm
else
    echo Docker is already downloaded. Just need to install it.
    rpm -i ${SNAP_CACHE_DIR}/docker/docker.rpm
fi

echo Starting docker service...
sudo service docker start

echo Pulling node docker image
sudo docker pull node:0.10-onbuild #TODO: Cache this too.
