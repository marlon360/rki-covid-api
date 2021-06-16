FROM rubber4duck/vips-node-alpine:latest

# common build flags
ENV CFLAGS=-O3
ENV CXXFLAGS=-O3

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Inside "npm install" the build tools and dev packages are needed to compile "sharp"
# against globaly installed lib vips in newest version
# Install the buildtools, dev packages of the required shared libs
# execute "npm install" and remove the buildtools and dev packages afterwards
RUN apk update \
 && apk upgrade \
 && apk add --no-cache --virtual .vips-dev build-base binutils \
     libjpeg-turbo-dev libpng-dev tiff-dev \
     librsvg-dev libgsf-dev libimagequant-dev py-gobject3-dev \
 && npm install \
 && apk del .vips-dev \
 && rm -rf /var/cache/apk/*
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD ["pm2-runtime", "dist/server.js", "-i", "-1"]
