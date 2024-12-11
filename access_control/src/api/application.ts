import { PORT } from '@config/environment';
import { ExpressServer } from '@api/server';
import { DatabaseAdapter } from '@common/infrastructure/database.adapter';
import { EventRegister } from '@common/event/event';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class Application {
    public static async createApplication(): Promise<ExpressServer> {
        await DatabaseAdapter.connect();
        await RabbitMQAdapter.connect();
        // await RedisAdapter.connect();

        Application.registerEvents();

        const expressServer = new ExpressServer();
        await expressServer.setup(PORT);

        return expressServer;
    }

    private static registerEvents() {
        EventRegister.register();
    }
}
