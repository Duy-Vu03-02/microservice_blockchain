import { createLogger } from '@common/infrastructure/logger';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class DataShareLog {
    private static nameService: string = 'data-share';
    private static logger = createLogger(DataShareLog.nameService);
    private static nameExchange: string = 'exchange_microservice';
    private static routingKey: string = 'data_share';

    public static register = async () => {
        await RabbitMQAdapter.subscribeTopic(DataShareLog.nameExchange, DataShareLog.routingKey, (data: any) => {
            const logInfor =
                'ADMIN co id = ' +
                data.admin_id +
                ' - co ten = ' +
                "'" +
                data.admin_name +
                "'" +
                ' - ACTION : ' +
                data.action +
                ' cho USER co ma CCCD = ' +
                data.patient_cccd +
                ' - BENH VIEN co id = ' +
                data.hospital_id;
            DataShareLog.logger.info(logInfor);
        });
    };
}
