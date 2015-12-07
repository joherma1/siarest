# How to run a siarest container on a raspberry pi

### 1. Mongo Database
  * [Optional] Build  
  `docker build -t joherma1/rpi-mongo deploy/mongo/. `
  * Run  
  ` docker pull joherma1/rpi-mongo`  
  ` docker run -p 27017:27017 --name mongo_sia -d joherma1/rpi-mongo`


### 2. SIARest
  * [Optional] Build  
  `docker build -t joherma1/rpi-siarest .`
  * Run  
  `docker pull joherma1/rpi-siarest`  
  `docker run --device=/dev/ttyACM0:/dev/cu.usbmodem1411 -p 3000:3000 --name siarest --link mongo_sia:mongo -d joherma1/rpi-siarest`
  * Monitor  
  `docker logs -f siarest`

### 2a. [Optional] Test siarest
`docker run --name mongo_sia_test -d joherma1/rpi-mongo`  
`docker run -i --link mongo_sia_test:mongo --rm joherma1/rpi-siarest:$GIT_COMMIT /bin/bash -c 'cd /opt/siarest/; npm test'`

### 3. [Optional] Docker compose
  * Run  
  `docker-compose up -d`
  * Monitor  
  `docker-compose logs` 


## Mongo cheatsheet
mongo  
show dbs  
use siarest  
show collections  
db.boards.find()  
db.boards.drop()  

## Docker cheatsheet
  * Attach ssh into container  
  `docker exec -it siarest /bin/bash`
  * Debug container  
  `docker run --rm -it [container_step] /bin/bash`

## RaspberryPi cheatsheet
  * Backup sd  
  `sudo dd if=/dev/rdisk1 bs=1m | gzip > ~/Desktop/pi.gz`
  * Restore backup  
  `gzip -dc ~/Desktop/pi.gz | sudo dd of=/dev/rdisk1 bs=1m`