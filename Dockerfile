FROM node:16.15.0

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]