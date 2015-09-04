#Mongo
docker build -t joherma1/rpi-mongo .
#docker pull joherma1/rpi-mongo

docker run --name mongo-sia -d joherma1/rpi-mongo

#Node
docker build -t joherma1/rpi-siarest .
#docker pull joherma1/rpi-siarest

docker run -p 80:3000 --name siarest --link mongo-sia:mongo -d joherma1/rpi-siarest
docker logs -f node-sia


#Docker compose
docker-compose up -d
docker-compose logs


#Attach ssh into container
docker exec -it siarest bash
#Backup sd
sudo dd if=/dev/rdisk1 bs=1m | gzip > ~/Desktop/pi.gz
gzip -dc ~/Desktop/pi.gz | sudo dd of=/dev/rdisk1 bs=1m

