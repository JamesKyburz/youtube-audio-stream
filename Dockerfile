FROM node:8.10.0-alpine
RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

RUN mkdir /app
COPY package.json /app
COPY package-lock.json /app
COPY index.js /app
COPY test /app/test

WORKDIR "/app"

RUN npm install

CMD npm test
