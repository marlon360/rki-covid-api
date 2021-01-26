FROM node:12-alpine

# common build flags
ENV CFLAGS=-O3
ENV CXXFLAGS=-O3

WORKDIR /tmp

# build dependencies, compile vips-8.10.5 and cleanup
RUN apk add --no-cache --virtual .builddep\
     gcc \
     g++ \
     make \
     file \
     gtk-doc \
     wget \
     pkgconfig \
     binutils && \
    apk add --no-cache \
     glib-dev \
     expat-dev \
     tiff-dev \
     libjpeg-turbo-dev \
     libpng-dev \
     giflib-dev \
     libgsf-dev \
     librsvg-dev && \
    wget https://github.com/libvips/libvips/releases/download/v8.10.5/vips-8.10.5.tar.gz && \
    tar xzf vips-8.10.5.tar.gz && \
    rm -rf vips-8.10.5.tar.gz && \
    cd vips-8.10.5 && \
    ./configure && \
    make && \
    make install && \
    cd .. && \
    rm -rf vips-8.10.5 && \
    apk del .builddep

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Inside "npm install" there are some build tools needed
# Install the tools, execute "npm install" and remove the tolls afterwards
RUN apk add --no-cache --virtual .builddep2 \
     gcc \
     g++ \
     make \
     binutils && \
    npm install && \
    apk del .builddep2
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD ["pm2-runtime", "dist/server.js", "-i", "-1"]
