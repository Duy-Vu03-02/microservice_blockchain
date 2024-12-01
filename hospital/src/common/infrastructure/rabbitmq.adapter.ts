import { URL_RABBITMQ } from '@config/environment';
import amqplib, { Channel, Connection } from 'amqplib';

export class RabbitMQAdapter {
    private static conn: Connection;
    private static channel: Channel;
    public static nameExchange: string = 'exchange_microservice';
    public static routingKey : string = 'hospital';

    public static connect = async (): Promise<Connection> => {
        const maxRetries = 5;
        const retryDelay = 5000;
        let retries = 0;

        while (retries < maxRetries) {
            try {
                if (!RabbitMQAdapter.conn) {
                    RabbitMQAdapter.conn = await amqplib.connect(URL_RABBITMQ);
                }

                return RabbitMQAdapter.conn;
            } catch (err) {
                retries++;
                console.error(
                    `Failed to connect to RabbitMQ. Attempt ${retries}/${maxRetries}`,
                    err
                );
                if (retries >= maxRetries) {
                    console.error('Max retries reached. Exiting...');
                    process.exit(1);                }
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
    };

    public static getChanel = async (): Promise<Channel> => {
        try {
            if (!RabbitMQAdapter.channel) {
                RabbitMQAdapter.channel = await(await RabbitMQAdapter.connect()).createChannel();
            }

            return RabbitMQAdapter.channel;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    public static close = async (): Promise<void> => {
        try {
            if (RabbitMQAdapter.channel) {
                await RabbitMQAdapter.channel.close();
            }

            if (RabbitMQAdapter.conn) {
                await RabbitMQAdapter.conn.close();
            }
        } catch (err) {
            console.error('CANNOT close MQTT: ', err);
        }
    };
}
