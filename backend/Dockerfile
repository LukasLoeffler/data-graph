FROM node:lts-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm ci --quiet && npm run build



FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet --only=production

EXPOSE 3000 3001

## We just need the build to execute the command
COPY --from=build-stage /usr/src/app/build ./build
COPY ./script ./script

RUN mkdir output
RUN mkdir temp


CMD [ "node", "./build/index.js" ]