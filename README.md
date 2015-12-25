# siarest
## Agricultural Information System API
* [`0.4`, `0.4.1`, `latest` (Dockerfile)](https://github.com/joherma1/siarest/blob/master/Dockerfile)

SIARest is the REST API developed in node.js to offer the services provided by the Arduino boards that are gathered in RasperryPi Servers

It is part of the SIA Architecture:
![SIA Architecture](https://raw.githubusercontent.com/joherma1/sia/master/doc/Architecture/SIA%20-%20Overview.png)



### How to run a siarest container on a raspberry pi

#### 1. Mongo Database
  * [Optional] Build   
  ```
  docker build -t joherma1/rpi-mongo deploy/mongo/.
  ```
  * Run   
  ```
  docker run -p 27017:27017 --name mongo_sia -d joherma1/rpi-mongo
  ```


#### 2. SIARest
  * [Optional] Build   
  ```
  docker build -t joherma1/rpi-siarest .
  ```
  * Run   
  ```
  docker run --device=/dev/ttyACM0:/dev/cu.usbmodem1411 -p 3000:3000 --name siarest --link mongo_sia:mongo -d joherma1/rpi-siarest
  ```
  * Monitor   
  ```
  docker logs -f siarest
  ```

#### 2a. [Optional] Test siarest
```
docker run --name mongo_sia_test -d joherma1/rpi-mongo
docker run -i --link mongo_sia_test:mongo --rm joherma1/rpi-siarest /bin/bash -c 'cd /opt/siarest/; npm test'
```

### 3. [Optional] Docker Compose
  * Run   
  ```
  docker-compose up -d
  ```
  * Monitor   
  ```
  docker-compose logs
  ```


### Mongo cheatsheet
```
mongo
show dbs
use siarest
show collections
db.boards.find()
db.boards.drop()
```

### Docker cheatsheet
  * Attach ssh into container   
  ```
  docker exec -it siarest /bin/bash
  ```
  * Debug container   
  ```
  docker run --rm -it [container_step] /bin/bash
  ```

### RaspberryPi cheatsheet
  * Backup sd   
  ```
  sudo dd if=/dev/rdisk1 bs=1m | gzip > ~/Desktop/pi.gz
  ```
  * Restore backup   
   ```
   gzip -dc ~/Desktop/pi.gz | sudo dd of=/dev/rdisk1 bs=1m
   ```