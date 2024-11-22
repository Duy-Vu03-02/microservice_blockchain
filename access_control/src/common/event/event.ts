import { IAuditLog, IPermissionRequest } from "@api/permissions/permission";
import eventbus from "@common/event";
import { RabbitMQAdapter } from "@common/infrastructure/rabbitmq.adapter";

export class EventRegister {
  public static EVENT_CHANGE_PERMISSION = "permission";

  public static register = () => {
    eventbus.on(
      EventRegister.EVENT_CHANGE_PERMISSION,
      EventRegister.handleChangePermission
    );
  };

  private static handleChangePermission = async (data: IAuditLog) => {
    try {
      const channel = await RabbitMQAdapter.getChanel();

      if (channel) {
        await channel.assertExchange(RabbitMQAdapter.nameExchange, "topic", {
          durable: false,
          autoDelete: true,
        });

        await channel.publish(
          RabbitMQAdapter.nameExchange,
          RabbitMQAdapter.responseQueue,
          Buffer.from(JSON.stringify(data))
        );
      }
    } catch (err) {
      console.error("Handle event FAILD ");
    }
  };
}
