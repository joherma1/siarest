FROM resin/raspberrypi-node
MAINTAINER Jose Antonio Hernandez Martinez <joherma1@gmail.com>

COPY src arduino config controllers lib models spec static views /opt/siarest/src

RUN cd /opt/siarest/src && npm install

EXPOSE 3000
CMD ["node", "/opt/siarest/src/bin/www"]