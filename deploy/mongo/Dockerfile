FROM resin/rpi-buildpack-deps:jessie
MAINTAINER Jose Antonio Hernandez Martinez <joherma1@gmail.com>

##TODO move to local COPY
RUN git clone https://github.com/Barryrowe/mongo-arm.git /opt/mongosrc &&  \
        cp -R /opt/mongosrc/binaries/2.1.1 /opt/mongo && \
        rm -r /opt/mongosrc

RUN mkdir /usr/src/data

EXPOSE 27017
CMD ["/opt/mongo/bin/mongod", "--dbpath", "/usr/src/data"]