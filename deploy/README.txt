#OS X
1- Download and install docker toolbox
2- Start docker machine
    docker-machine start default
2.1 - Export variables and port
    eval "$(docker-machine env default)"
3- Connect the docker client to the docker daemon (localhost)
    #docker -H tcp://0.0.0.0:2375 -H ps
    docker

#OR SIMPLY
open /Applications/Docker/Docker\ Quickstart\ Terminal.app/



#Mongo
docker pull mongo

#node app
docker build -t joherma1/siarest:0.1 .
docker build --no-cache -t joherma1/siarest:0.1 .

#Run
docker run --name mongo-sia -d mongo
docker run -p 8080:3000 --name node-sia --link mongo-sia:mongo -d joherma1/siarest:0.1


#Docker compose
docker-compose up -d



#Docker cheats
curl $(docker-machine ip default):8080
docker rmi -f $(docker images -q)
docker logs -f node-sia
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)