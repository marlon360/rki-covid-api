FROM rubber4duck/node16-alpine-vips:latest

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
 && apk add --no-cache --virtual .vips-deps build-base binutils \
   zlib-dev libxml2-dev glib-dev gobject-introspection-dev \
   libjpeg-turbo-dev libexif-dev lcms2-dev fftw-dev giflib-dev \
   libpng-dev libwebp-dev orc-dev tiff-dev poppler-dev librsvg-dev \
   libgsf-dev openexr-dev libheif-dev libimagequant-dev pango-dev\
   py-gobject3-dev \
 && apk --no-cache add msttcorefonts-installer fontconfig \
 && update-ms-fonts \
 && fc-cache -f \ 
 && npm install \
 && apk del .vips-deps \
 && rm -rf /var/cache/apk/*

# If you are building your code for production
# RUN npm ci --only=production

RUN npm install pm2 -g

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD ["pm2-runtime", "dist/server.js", "-i", "-1"]
