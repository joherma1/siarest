FROM resin/raspberrypi-node
MAINTAINER Jose Antonio Hernandez Martinez <joherma1@gmail.com>

COPY arduino config controllers lib models spec static views /opt/siarest/

RUN cd /opt/siarest && npm install

EXPOSE 3000
CMD ["node", "/opt/siarest/src/bin/www"]