FROM node:12-alpine3.12

# common build flags
ENV CFLAGS=-O3
ENV CXXFLAGS=-O3

WORKDIR /tmp

# build dependencies, compile vips-8.10.5 and cleanup.
RUN wget -O- https://github.com/libvips/libvips/releases/download/v8.10.5/vips-8.10.5.tar.gz | tar xzC /tmp \
 && apk add --no-cache zlib libxml2 glib gobject-introspection libjpeg-turbo libexif lcms2 fftw giflib libpng \
     libwebp orc tiff poppler-glib librsvg libgsf openexr libheif libimagequant pango \
 && apk add --no-cache --virtual .vips-deps build-base binutils zlib-dev libxml2-dev glib-dev gobject-introspection-dev \
     libjpeg-turbo-dev libexif-dev lcms2-dev fftw-dev giflib-dev libpng-dev libwebp-dev orc-dev tiff-dev \
     poppler-dev librsvg-dev libgsf-dev openexr-dev libheif-dev libimagequant-dev pango-dev py-gobject3-dev \
 && cd vips-8.10.5 \
 && ./configure --prefix=/usr \
                --disable-static \
                --disable-dependency-tracking \
                --enable-silent-rules \
 && make -s install-strip \
 && cd .. \
 && rm -rf vips-8.10.5 /var/cache/apk/* \
 && apk del .vips-deps

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Inside "npm install" there are some build tools needed
# Install the tools, execute "npm install" and remove the tolls afterwards
RUN apk add --no-cache --virtual .vips-deps build-base binutils zlib-dev libxml2-dev glib-dev gobject-introspection-dev \
     libjpeg-turbo-dev libexif-dev lcms2-dev fftw-dev giflib-dev libpng-dev libwebp-dev orc-dev tiff-dev \
     poppler-dev librsvg-dev libgsf-dev openexr-dev libheif-dev libimagequant-dev pango-dev py-gobject3-dev \
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
