# base
FROM node:carbon-alpine as base

USER node
RUN mkdir -p /home/node/client
WORKDIR /home/node/client
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
FROM nginx:stable-alpine as production

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /home/node/client/dist /usr/share/nginx/html
