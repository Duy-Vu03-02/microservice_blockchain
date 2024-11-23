import amqplib, { Options, Channel, Connection } from 'amqplib';
import { URL_RABBITMQ } from '@config/environment';
import { logger } from './logger';

export class RabbitMQAdapter {
    private static channel: Channel;
    private static conn: Connection;

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

    private static getChanel = async (): Promise<Channel> => {
        try {
            if (!RabbitMQAdapter.channel) {
                RabbitMQAdapter.channel = await (await RabbitMQAdapter.connect()).createChannel();
            }

            return RabbitMQAdapter.channel;
        } catch (err) {
            console.error('MQTT: GET Channel FAILD: ', err);
        }
    };

    public static closeRabbitMQ = async () => {
        try {
            if (RabbitMQAdapter.channel) {
                await RabbitMQAdapter.channel.close();
            }
            if (RabbitMQAdapter.conn) {
                await RabbitMQAdapter.conn.close();
            }
        } catch (err) {
            console.error('Cannot close RabbitMQ: ', err);
        }
    };

    public static subscribeTopic = async (exchange: string, topic: string, callback: (mesage: string) => void) => {
        try {
            await (
                await RabbitMQAdapter.getChanel()
            ).assertExchange(exchange, 'topic', {
                durable: false,
            });

            const { queue } = await (await RabbitMQAdapter.getChanel()).assertQueue('', { exclusive: false });

            await (await RabbitMQAdapter.getChanel()).bindQueue(queue, exchange, topic);

            logger.info(`Subscribe TOPIC ${topic} SUCCESS`);
            
            
            (await RabbitMQAdapter.getChanel()).consume(queue, (message) => {
                if (message) {
                    const content = message.content.toString();
                    callback(JSON.parse(content));
                    RabbitMQAdapter.channel.ack(message);
                }
            });
        } catch (err) {
            logger.info(`Khong the subsribe topic: ${topic} : ${err}`);
        }
    };
}
