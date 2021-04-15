FROM node:12-alpine3.12

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
# To not install and deinstall the the build tools and dev packages twice the build process for libvips moved to here!
# This will save some Dockerimage build time
# Install the buildtools, dev packages of the required shared libs, compile, install libvips and cleanup
# execute "npm install" and remove the buildtools and dev packages afterwards
RUN apk update \
 && apk upgrade \
 && apk add --no-cache zlib libxml2 glib gobject-introspection libjpeg-turbo libexif lcms2 fftw giflib libpng \
     libwebp orc tiff poppler-glib librsvg libgsf openexr libheif libimagequant pango \
 && wget -O- https://github.com/libvips/libvips/releases/download/v8.10.5/vips-8.10.5.tar.gz | tar xzC /tmp \
 && apk add --no-cache --virtual .vips-deps build-base binutils zlib-dev libxml2-dev glib-dev gobject-introspection-dev \
     libjpeg-turbo-dev libexif-dev lcms2-dev fftw-dev giflib-dev libpng-dev libwebp-dev orc-dev tiff-dev \
     poppler-dev librsvg-dev libgsf-dev openexr-dev libheif-dev libimagequant-dev pango-dev py-gobject3-dev \
 && ODIR=$(pwd) \
 && cd /tmp/vips-8.10.5 \
 && ./configure --prefix=/usr \
                --disable-static \
                --disable-dependency-tracking \
                --enable-silent-rules \
 && make -s install-strip \
 && cd $ODIR \
 && rm -rf /tmp/vips-8.10.5 /var/cache/apk/* \
 && npm install \
 && apk del .vips-deps
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD ["pm2-runtime", "dist/server.js", "-i", "-1"]
