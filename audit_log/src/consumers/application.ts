import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class Application {
    public static async createApplication(): Promise<void> {
        await DatabaseAdapter.connect();
        // await RedisAdapter.connect();
        // await RabbitMQAdacpter.connect();
    }
}
