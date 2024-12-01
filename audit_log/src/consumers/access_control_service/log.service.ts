import { createLogger } from '@common/infrastructure/logger';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class AccessControlLog {
    private static nameService: string = 'access-control';
    private static logger = createLogger(AccessControlLog.nameService);
    private static nameExchange: string = 'exchange_microservice';
    private static routingKey: string = 'access_control';

    public static register = async () => {
        await RabbitMQAdapter.subscribeTopic(
            AccessControlLog.nameExchange,
            AccessControlLog.routingKey,
            (data: any) => {
                const logInfor =
                    'ADMIN co id = ' +
                    data.admin_id +
                    ' - co ten = ' +
                    "'" +
                    data.admin_name +
                    "'" +
                    ' - ACTION : ' +
                    data.action +
                    ' cho USER co id = ' +
                    data.user_id +
                    ' - co ten = ' +
                    "'" +
                    data.user_name +
                    "'" +
                    ' voi ROLE moi = ' +
                    data.role;
                AccessControlLog.logger.info(logInfor);
            },
        );
    };
}
