import {EventEmitter}  from "events";
import { RabbitMQAdapter } from "./infrastructure/rabbitmq.adapter";

const eventbus = new EventEmitter();

export class EventRegister{
    public static EVENT_SHARE_DATA ="event.share.data";
    public static EVENT_RECEIVE_DATA ="event.receive.data";

    public static register=  () => {
        eventbus.on(EventRegister.EVENT_SHARE_DATA, EventRegister.shareData);
        eventbus.on(EventRegister.EVENT_RECEIVE_DATA, EventRegister.receiveData);
    }

    private static shareData = async(data) => {
        try{
            const channel = await RabbitMQAdapter.getChanel();

            if(channel){
                await channel.assertExchange(RabbitMQAdapter.nameExchange, "topic", {
                    durable: false,
                });

                channel.publish(
                    RabbitMQAdapter.nameExchange,
                    RabbitMQAdapter.routingKey,
                    Buffer.from(JSON.stringify({
                        ...data,
                        action: "share data"
                    }))
                )
            }
        }
        catch(err){
            console.error(err);
        }
    }
    private static receiveData = async(data) => {
        try{
            const channel = await RabbitMQAdapter.getChanel();

            if(channel){
                await channel.assertExchange(RabbitMQAdapter.nameExchange, "topic", {
                    durable: false,
                });

                channel.publish(
                    RabbitMQAdapter.nameExchange,
                    RabbitMQAdapter.routingKey,
                    Buffer.from(JSON.stringify({
                        ...data,
                        action: "receive data"
                    }))
                )
            }
        }
        catch(err){
            console.error(err);
        }
    }
}

export default eventbus;