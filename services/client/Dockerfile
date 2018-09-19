FROM node:carbon-alpine as install

USER node
RUN mkdir -p /home/node/client
WORKDIR /home/node/client
COPY ./package*.json ./
RUN npm install
COPY . .

FROM install as production

USER node
WORKDIR /home/node/client
RUN npm run build
