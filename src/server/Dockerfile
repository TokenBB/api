FROM node:carbon-alpine

USER node
RUN mkdir -p /home/node/tokenbb-server
WORKDIR /home/node/tokenbb-server

COPY ./package.json .
RUN npm install
COPY . .

CMD [ "node", "src/server/index.js" ]
