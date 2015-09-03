FROM resin/raspberrypi-node
MAINTAINER Jose Antonio Hernandez Martinez <joherma1@gmail.com>

RUN apt-get update && apt-get install -y \
    unzip

#Download the code
#Move to git
RUN wget --no-check-certificate https://github.com/joherma1/siarest/archive/master.zip && \
    unzip -q master.zip -d /usr/src/

RUN cd /usr/src/siarest-master && rm -rf node_modules && npm install

EXPOSE 3000
CMD ["node", "/usr/src/siarest-master/bin/www"]