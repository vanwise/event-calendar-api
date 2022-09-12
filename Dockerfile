FROM node:16.15.0

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "start:dev"]