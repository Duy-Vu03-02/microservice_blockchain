import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';
import { AccessControlLog } from './access_control_service/log.service';
import { PatientManagementLLog } from './patients_management_service/log.service';
import { DataShareLog } from './data_share_service/log.service';
import { HospitalLLog } from './hospital_service/log.service';

export class Application {
    public static async createApplication(): Promise<void> {
        await DatabaseAdapter.connect();
        await RabbitMQAdapter.connect();
        // await RedisAdapter.connect();
    
        await Application.register();
    }

    public static register = async () => {
        await AccessControlLog.register();
        await PatientManagementLLog.register()
        await DataShareLog.register();
        await HospitalLLog.register();
    }
}
