import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';
import { LoggingService } from '../../../shared/logging/logging.service';
import { IMessagingClient } from './messagingClient.interface';

@Injectable()
export class NatsMessagingClient
  implements IMessagingClient, OnModuleInit, OnModuleDestroy
{
  private natsConnection: NatsConnection;

  constructor(private readonly logger: LoggingService) {}

  async onModuleInit() {
    try {
      this.natsConnection = await connect({
        servers: process.env.BPI_NATS_SERVER_URL,
        user: process.env.BPI_NATS_SERVER_USER,
        pass: process.env.BPI_NATS_SERVER_PASS
      });
      this.logger.logInfo(
        'Connected to nats server: ' + this.natsConnection.getServer(),
      );
    } catch (err) {
      this.logger.logWarn(
        `Error: ${err} connecting to nats server at: ${process.env.BPI_NATS_SERVER_URL}`,
      );
    }
  }

  async onModuleDestroy() {
    if (!this.isNatsConnectionClosed()) {
      await this.natsConnection.drain();
    }
  }

  async subscribe(
    channelName: string,
    callback: (message: string) => void,
  ): Promise<void> {
    if (this.isNatsConnectionClosed()) {
      this.logger.logWarn(
        `Trying to subscribe without an open nats connection`,
      );
      return;
    }

    const stringCodec = StringCodec();
    const subscription = this.natsConnection.subscribe(channelName);

    for await (const message of subscription) {
      const messageContent = stringCodec.decode(message.data);
      this.logger.logInfo(
        `${subscription.getSubject()}: [${subscription.getProcessed()}] : ${messageContent}`,
      );
      callback(messageContent);
    }
  }

  async publish(channelName: string, message: string): Promise<void> {
    if (this.isNatsConnectionClosed()) {
      this.logger.logWarn(`Trying to publish without an open nats connection`);
      return;
    }

    this.natsConnection.publish(channelName, StringCodec().encode(message));
  }

  private isNatsConnectionClosed(): boolean {
    return !this.natsConnection || this.natsConnection.isClosed();
  }
}
