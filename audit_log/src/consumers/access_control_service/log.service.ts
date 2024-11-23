import { createLogger } from '@common/infrastructure/logger';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class AccessControlLog {
    private static nameService: string = 'access-control';
    private static logger = createLogger(AccessControlLog.nameService);
    private static nameExchange: string = 'exchange_microservice';
    private static responseQueue: string = AccessControlLog.nameService;

    public static register = async () => {
        await RabbitMQAdapter.subscribeTopic(AccessControlLog.nameExchange, AccessControlLog.responseQueue, (data) => {
            console.log(data);
        });
    };
}
