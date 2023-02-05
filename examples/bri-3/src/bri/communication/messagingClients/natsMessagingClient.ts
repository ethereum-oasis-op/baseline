import { Injectable } from '@nestjs/common';
import { connect, StringCodec } from 'nats';
import { LoggingService } from 'src/shared/logging/logging.service';
import { IMessagingClient } from './messagingClient.interface';

@Injectable()
export class NatsMessagingClient implements IMessagingClient {
  constructor(private readonly log: LoggingService) {}

  async subscribe(
    channelName: string,
    callback: (message: string) => void,
  ): Promise<void> {
    const sc = StringCodec();
    const nc = await connect({ servers: process.env.BPI_NATS_SERVER_URL });
    this.log.logInfo('Connected NatsMessagingClient to: ' + nc.getServer());

    const subscription = nc.subscribe(channelName);

    for await (const message of subscription) {
      const messageContent = sc.decode(message.data);
      this.log.logInfo(
        `${subscription.getSubject()}: [${subscription.getProcessed()}] : ${messageContent}`,
      );
      callback(messageContent);
    }
  }

  async publish(channelName: string, message: string): Promise<void> {
    const sc = StringCodec();
    const nc = await connect({ servers: process.env.BPI_NATS_SERVER_URL });

    nc.publish(channelName, sc.encode(message));
    await nc.drain(); // TODO: Investigate further if it is neccesary to close the connection here
  }
}
