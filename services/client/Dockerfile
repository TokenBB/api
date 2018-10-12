FROM node:carbon-alpine as node

ENV SRC=/home/node/client
ENV DEST=/usr/share/nginx/html

USER node

# base
FROM node as base

RUN mkdir -p ${SRC}
WORKDIR ${SRC}
COPY ./package*.json ./
RUN npm install
COPY . .
COPY ./_secure-random.patch.js ./node_modules/secure-random/lib/secure-random.js

# build
FROM base as build

ARG NODE_ENV
ARG HOST_URL
ARG STEEM_NETWORK
ARG STEEM_APP_ACCOUNT
ARG STEEM_CONNECT_HOST
ARG STEEM_CONNECT_ACCOUNT

RUN ["npm", "run", "build"]

# production
FROM node as production

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build ${SRC}/dist ${DEST}