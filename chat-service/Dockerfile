FROM node:21

WORKDIR /user/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3001

COPY ./wait-for-it.sh /usr/local/bin/wait-for-it

RUN chmod +x /usr/local/bin/wait-for-it

CMD ["wait-for-it", "rabbitmq:5672", "--", "yarn", "run", "dev"]