FROM node:12

# common build paths and flags
ENV DEST /opt
ENV PKG_CONFIG_PATH ${PKG_CONFIG_PATH}:${DEST}/lib/pkgconfig
ENV LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:${DEST}/lib
ENV PATH ${PATH}:${DEST}/bin
ENV CPPFLAGS -I${DEST}/include
ENV LDFLAGS -L${DEST}/lib
ENV CFLAGS -O3
ENV CXXFLAGS -O3

# build dependencies, libvips and cleanup
WORKDIR /tmp
RUN apt-get update && apt-get install -y \
        build-essential \
        pkg-config \
        gtk-doc-tools \
        glib2.0-dev \
        curl \
        gettext \
        nasm \
        zlib1g-dev \
        libjpeg-dev \
        libpng-dev \
        libtiff5-dev \
        libexpat1-dev \
        libgif-dev \
        libgsf-1-dev \
        && curl -sOL https://github.com/libvips/libvips/releases/download/v8.10.5/vips-8.10.5.tar.gz \
        && tar zxf vips-8.10.5.tar.gz \
        && cd vips-8.10.5 \
        && ./configure --prefix=${DEST} \
        && make \
        && make install \
        && ldconfig \
        && apt-get autoremove --purge -y build-essential curl gettext nasm gtk-doc-tools\
        && apt-get -y clean \
        && rm -rf /var/lib/apt/lists/* \
        && rm -rf /tmp/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD ["pm2-runtime", "dist/server.js", "-i", "-1"]
