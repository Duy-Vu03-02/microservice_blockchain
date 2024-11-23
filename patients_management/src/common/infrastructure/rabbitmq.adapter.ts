import { URL_RABBITMQ } from '@config/environment';
import amqplib, { Channel, Connection } from 'amqplib';

export class RabbitMQAdapter {
    private static conn: Connection;
    private static channel: Channel;
    public static nameExchange: string = 'exchange_microservice';
    public static responseQueue: string = 'patient-service';

    public static connect = async (): Promise<void> => {
        try {
            const conn = await amqplib.connect(URL_RABBITMQ);
            const channel = await conn.createChannel();

            RabbitMQAdapter.conn = conn;
            RabbitMQAdapter.channel = channel;
        } catch (err) {
            console.error(err);
        }
    };

    public static getChanel = async (): Promise<Channel> => {
        try {
            if (!RabbitMQAdapter.channel) {
                await RabbitMQAdapter.connect();
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
