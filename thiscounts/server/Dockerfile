#docker build -t lowla/thiscounts .
#docker run -it -p 9000:9000 -e MONGODB_URI='mongodb://localhost/lowla-dev' lowla/thiscounts
#docker run -it -p 9000:9000 -e MONGODB_URI='mongodb://docker.for.mac.host.internal/lowla-dev' lowla/thiscounts
#docker run -it -p 8080:8080 -e MONGODB_URI='mongodb://docker.for.mac.host.internal/lowla-dev' -e NODE_ENV='production' -e NEO4J_URI='http://docker.for.mac.host.internal:7474' lowla/thiscounts /bin/bash

#FROM  lowla/thiscounts
FROM ubuntu:latest
MAINTAINER Moshe Beeri <moshe@this.deals>

RUN apt-get update && apt-get install -y \
  curl \
  ruby \
  ruby-dev \
  imagemagick

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y nodejs git \
  libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
RUN mkdir ~/.ssh
RUN ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts

COPY gitkeys/id_rsa* /root/.ssh/

RUN cd / && git clone git@bitbucket.org:moshebeeri/low.la.git
WORKDIR /low.la/thiscounts
RUN npm install
RUN npm install grunt
RUN npm install -g grunt-cli
RUN npm install -g forever
RUN gem install sass
RUN npm install -g bower
RUN bower install --allow-root
#RUN grunt --force build
RUN mkdir public && echo "" >> public/favicon.ico

EXPOSE 9000
CMD [ "node", "./server/app.js" ]
#CMD [ "grunt", "serve" ]
#CMD [ "forever", "start ./server/app.js" ]
