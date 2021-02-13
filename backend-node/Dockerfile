FROM node:12-alpine

WORKDIR /usr/src/ 

COPY package*.json ./


RUN npm install -g typescript
RUN npm install

RUN npm build

COPY ./build .
COPY ./script ./script

RUN mkdir output
RUN mkdir temp

EXPOSE 3000 3001

CMD [ "node", "index.js" ]