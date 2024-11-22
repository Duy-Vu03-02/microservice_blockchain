import { EventEmitter } from 'events';
import { UserController } from './user.controller';

const eventbus = new EventEmitter();
export const EVENT_USER ="event.user";

export class EventBus{
  public static nameExchange: string = "exchange_microservice";
  public static requestQueue: string = "notification.chat";
    public static register = () => {
        eventbus.on(EVENT_USER, EventBus.handle)
    }

    public static handle = async(data: any) => {
        try{
          await (await UserController.register()).assertExchange(
            EventBus.nameExchange,
            "topic",
            {
              durable: false,
              autoDelete: true,
            }
          );
          await (await UserController.register()).publish(
            EventBus.nameExchange,
            EventBus.requestQueue,
            Buffer.from(JSON.stringify(data))
          );
        }
        catch(err){
          console.error(err);
        }
    }
}

export default eventbus;