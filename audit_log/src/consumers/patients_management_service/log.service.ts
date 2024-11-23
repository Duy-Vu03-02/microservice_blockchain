import { createLogger } from '@common/infrastructure/logger';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class PatientManagementLLog {
    private static nameService: string = 'patient-service';
    private static logger = createLogger(PatientManagementLLog.nameService);
    private static nameExchange: string = 'exchange_microservice';
    private static routingKey: string = 'patient_management';

    public static register = async () => {
        await RabbitMQAdapter.subscribeTopic(
            PatientManagementLLog.nameExchange,
            PatientManagementLLog.routingKey,
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
                    ' cho user co id = ' +
                    data.user_id +
                    ' - co ten = ' +
                    "'" +
                    data.user_name +
                    "'";
                console.log(logInfor);
                PatientManagementLLog.logger.info(logInfor);
            },
        );
    };
}
