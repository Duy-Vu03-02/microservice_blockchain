import express from 'express';
import router from './data-share.route';
import { BUILD_URL, DatabaseAdapter, PORT } from './infrastructure/database.adapter';
import bodyParser from 'body-parser';
import { EventRegister } from './event';
import { Web3Service } from './web3';
import { RabbitMQAdapter } from './infrastructure/rabbitmq.adapter';

export class Application {
    public static register = async () => {
        await Web3Service.register();
        await DatabaseAdapter.connect();
        await RabbitMQAdapter.connect();

        const app = express();
        app.use(bodyParser.json());
        app.use(router);
        
        EventRegister.register();
        app.listen(PORT, () => {
            console.log('Service SHARE DATA start SUCCESS!!!');
        });
    };
}

Application.register().catch(() => {
    console.log('Service SHARE DATA start FAILD');
})