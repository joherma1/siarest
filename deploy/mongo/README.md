ARM mongodb version.
Based on the binaries available for debian.
* [`latest` (Dockerfile)](https://github.com/joherma1/siarest/blob/master/deploy/mongo/Dockerfile)

![empty](http://cdn.shopify.com/s/files/1/0279/1227/t/5/assets/highsnobiety-logo-badge-white.svg?75070636155751373 "empty")


![mongodb](https://raw.githubusercontent.com/docker-library/docs/master/mongo/logo.png "mongodb")
How to use this image start a mongo instance
  * Build
```
    docker build -t joherma1/rpi-mongo deploy/mongo/.
```
  * Or download
  ```
    docker pull joherma1/rpi-mongo
  ```
  * Run
  ```
    docker run -p 27017:27017 --name mongo_sia -d joherma1/rpi-mongo
  ```

