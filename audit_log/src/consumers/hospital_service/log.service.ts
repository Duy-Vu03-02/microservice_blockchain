import { createLogger } from '@common/infrastructure/logger';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class HospitalLLog {
    private static nameService: string = 'hospital-service';
    private static logger = createLogger(HospitalLLog.nameService);
    private static nameExchange: string = 'exchange_microservice';
    private static routingKey: string = 'hospital';

    public static register = async () => {
        await RabbitMQAdapter.subscribeTopic(
            HospitalLLog.nameExchange,
            HospitalLLog.routingKey,
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
                    ' cho BENH VIEN co id = ' +
                    data.user_id +
                    ' - co ten = ' +
                    "'" +
                    data.user_name +
                    "'";
                HospitalLLog.logger.info(logInfor);
            },
        );
    };
}
