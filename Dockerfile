## build
FROM node:16-alpine AS builder

COPY . /app

WORKDIR /app

RUN yarn
RUN yarn build

## prod
FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=builder /app ./

RUN rm .env
RUN COPY .env.prod .env

EXPOSE 3000

CMD [ "yarn", "start:prod" ]