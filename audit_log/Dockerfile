FROM node:21

WORKDIR /user/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 6002

COPY ./wait-for-it.sh /usr/local/bin/wait-for-it

RUN chmod +x /usr/local/bin/wait-for-it

# Khởi động ứng dụng
CMD ["wait-for-it", "rabbitmq:5672", "--", "yarn", "run", "dev"]