import { createLogger } from '@common/infrastructure/logger';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class PatientManagementLLog {
    private static nameService: string = 'patient-service';
    private static logger = createLogger(PatientManagementLLog.nameService);
    private static nameExchange: string = 'exchange_microservice';
    private static responseQueue: string = PatientManagementLLog.nameService;

    public static register = async () => {
        await RabbitMQAdapter.subscribeTopic(
            PatientManagementLLog.nameExchange,
            PatientManagementLLog.responseQueue,
            (data) => {
                console.log(data);
            },
        );
    };
}
