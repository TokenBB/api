FROM node:carbon-alpine as build

RUN npm install http-server -g
USER node
RUN mkdir -p /home/node/tokenbb-client
WORKDIR /home/node/tokenbb-client
COPY ./package*.json .
RUN npm install
COPY . .
RUN NODE_ENV=production npm run build:client

CMD ["http-server", "dist"]
