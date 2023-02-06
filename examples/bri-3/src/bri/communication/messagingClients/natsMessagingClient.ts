import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';
import { LoggingService } from '../../../shared/logging/logging.service';
import { IMessagingClient } from './messagingClient.interface';

@Injectable()
export class NatsMessagingClient
  implements IMessagingClient, OnModuleInit, OnModuleDestroy
{
  private nc: NatsConnection;

  constructor(private readonly log: LoggingService) {}

  async onModuleInit() {
    try {
      this.nc = await connect({ servers: process.env.BPI_NATS_SERVER_URL });
      this.log.logInfo('Connected to nats server: ' + this.nc.getServer());
    } catch (err) {
      this.log.logWarn(
        `Error: ${err} connecting to nats server at: ${process.env.BPI_NATS_SERVER_URL}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.nc && !this.nc.isClosed()) {
      await this.nc.drain();
    }
  }

  async subscribe(
    channelName: string,
    callback: (message: string) => void,
  ): Promise<void> {
    if (!this.nc || this.nc.isClosed()) {
      this.log.logWarn(`Trying to subscribe without an open nats connection`);
      return;
    }

    const sc = StringCodec();
    const subscription = this.nc.subscribe(channelName);

    for await (const message of subscription) {
      const messageContent = sc.decode(message.data);
      this.log.logInfo(
        `${subscription.getSubject()}: [${subscription.getProcessed()}] : ${messageContent}`,
      );
      callback(messageContent);
    }
  }

  async publish(channelName: string, message: string): Promise<void> {
    if (!this.nc || this.nc.isClosed()) {
      this.log.logWarn(`Trying to publish without an open nats connection`);
      return;
    }

    const sc = StringCodec();
    this.nc.publish(channelName, sc.encode(message));
  }
}
