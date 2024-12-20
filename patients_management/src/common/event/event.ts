// import { IAuditLog, IPermissionRequest } from "@api/permissions/permission";
import eventbus from '@common/event';
import { RabbitMQAdapter } from '@common/infrastructure/rabbitmq.adapter';

export class EventRegister {
    public static EVENT_ADD_HISTORY = 'add.history';
    public static EVENT_CREATE_PATIENT = 'create.patient';
    public static EVENT_UPDATE_PATIENT = 'update.patient';
    public static EVENT_DELETE_PATIENT = 'delete.patient';

    public static register = () => {
        eventbus.on(EventRegister.EVENT_ADD_HISTORY, EventRegister.handleAddHistory);
        eventbus.on(EventRegister.EVENT_CREATE_PATIENT, EventRegister.handleCreatePatient);
        eventbus.on(EventRegister.EVENT_UPDATE_PATIENT, EventRegister.handleUpdatePatient);
        eventbus.on(EventRegister.EVENT_DELETE_PATIENT, EventRegister.handleDeletePatient);
    };

    private static handleCreatePatient = async (data: any) => {
        const channel = await RabbitMQAdapter.getChanel();

        if (channel) {
            await channel.assertExchange(RabbitMQAdapter.nameExchange, 'topic', {
                durable: false,
            });

            channel.publish(
                RabbitMQAdapter.nameExchange,
                RabbitMQAdapter.routingKey,
                Buffer.from(
                    JSON.stringify({
                        ...data,
                        action: 'create patient',
                    }),
                ),
            );
        }
    };

    private static handleUpdatePatient = async (data: any) => {
        const channel = await RabbitMQAdapter.getChanel();

        if (channel) {
            await channel.assertExchange(RabbitMQAdapter.nameExchange, 'topic', {
                durable: false,
                autoDelete: true,
            });

            channel.publish(
                RabbitMQAdapter.nameExchange,
                RabbitMQAdapter.routingKey,
                Buffer.from(
                    JSON.stringify({
                        ...data,
                        action: 'update patient',
                    }),
                ),
            );
        }
    };

    private static handleAddHistory = async (data: any) => {
        try {
            const channel = await RabbitMQAdapter.getChanel();

            if (channel) {
                await channel.assertExchange(RabbitMQAdapter.nameExchange, 'topic', {
                    durable: false,
                    autoDelete: true,
                });

                channel.publish(
                    RabbitMQAdapter.nameExchange,
                    RabbitMQAdapter.routingKey,
                    Buffer.from(
                        JSON.stringify({
                            ...data,
                            action: 'add history patient',
                        }),
                    ),
                );
            }
        } catch (err) {
            console.error('Handle event add History');
        }
    };

    private static handleDeletePatient = async (data: any) => {
        try {
            const channel = await RabbitMQAdapter.getChanel();

            if (channel) {
                await channel.assertExchange(RabbitMQAdapter.nameExchange, 'topic', {
                    durable: false,
                    autoDelete: true,
                });

                channel.publish(
                    RabbitMQAdapter.nameExchange,
                    RabbitMQAdapter.routingKey,
                    Buffer.from(
                        JSON.stringify({
                            ...data,
                            action: 'delete patient',
                        }),
                    ),
                );
            }
        } catch (err) {
            console.error('Handle event add History');
        }
    };
}
