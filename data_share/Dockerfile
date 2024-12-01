FROM node:21

WORKDIR /user/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 6003

COPY ./wait-for-it.sh /usr/local/bin/wait-for-it

RUN chmod +x /usr/local/bin/wait-for-it

COPY ./build/contracts/MedicalDataSharing.json /usr/local/bin/MedicalDataSharing.json

RUN chmod 777 /usr/local/bin/MedicalDataSharing.json
# Khởi động ứng dụng
CMD ["wait-for-it", "rabbitmq:5672", "--", "yarn", "run", "dev"]