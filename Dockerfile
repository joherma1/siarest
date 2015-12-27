FROM hypriot/rpi-node:4.2
MAINTAINER Jose Antonio Hernandez Martinez <joherma1@gmail.com>

COPY arduino /opt/siarest/arduino
COPY bin /opt/siarest/bin
COPY config /opt/siarest/config
COPY controllers /opt/siarest/controllers
COPY lib /opt/siarest/lib
COPY models /opt/siarest/models
COPY spec /opt/siarest/spec
COPY static /opt/siarest/static
COPY views /opt/siarest/views
COPY package.json /opt/siarest/
COPY app.js /opt/siarest/

RUN cd /opt/siarest && npm install

EXPOSE 3000
CMD ["node", "/opt/siarest/bin/www"]