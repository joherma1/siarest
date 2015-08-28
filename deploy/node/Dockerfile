FROM node:latest
MAINTAINER Jose Antonio Hernandez Martinez <joherma1@gmail.com>

#ARM Architecture
#FROM hypriot/rpi-node:latest


RUN apt-get update && apt-get install -y \
    unzip

#Download the code
#Move to git
RUN wget https://github.com/joherma1/siarest/archive/master.zip
RUN unzip -q master.zip -d /usr/src/

RUN ls -la /usr/src/siarest-master
RUN cd /usr/src/siarest-master && rm -rf node_modules && npm install


EXPOSE 3000
CMD ["node", "/usr/src/siarest-master/bin/www"]