#Mongo
docker build -t joherma1/rpi-mongo .
#docker pull joherma1/rpi-mongo

docker run --name mongo-sia -d joherma1/rpi-mongo

#Node
docker build -t joherma1/rpi-siarest .
#docker pull joherma1/rpi-siarest

docker run -p 3000:3000 --name node-sia --link mongo-sia:mongo -d joherma1/rpi-siarest
docker logs -f node-sia


#Docker compose
docker-compose up -d