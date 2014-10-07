#!/bin/bash

echo Installing docker
sudo yum -y install docker-io

echo Starting docker service...
sudo umount cgroup
sudo service cgconfig start
sudo service docker start

echo Pulling node docker image
sudo docker pull node:0.10-onbuild #TODO: Cache this

sudo docker build -t writeitdown
sudo docker rm writeitdown
sudo docker run -d --name writeitdown writeitdown
