FROM node:carbon-alpine as install

USER node
RUN mkdir -p /home/node/server
WORKDIR /home/node/server
COPY ./package*.json ./
RUN npm install
COPY . .

