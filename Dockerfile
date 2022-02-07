FROM node:16
WORKDIR /usr/src/clean-code-api
COPY ./.env .
COPY ./package.json .
RUN npm install --only=prod

