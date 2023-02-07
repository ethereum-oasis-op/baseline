import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';
import { LoggingService } from '../../../shared/logging/logging.service';
import { IMessagingClient } from './messagingClient.interface';

@Injectable()
export class NatsMessagingClient
  implements IMessagingClient, OnModuleInit, OnModuleDestroy
{
  private natsConn: NatsConnection;

  constructor(private readonly logger: LoggingService) {}

  async onModuleInit() {
    try {
      this.natsConn = await connect({ servers: process.env.BPI_NATS_SERVER_URL });
      this.logger.logInfo('Connected to nats server: ' + this.natsConn.getServer());
    } catch (err) {
      this.logger.logWarn(
        `Error: ${err} connecting to nats server at: ${process.env.BPI_NATS_SERVER_URL}`,
      );
    }
  }

  async onModuleDestroy() {
    if (!this.isNatsConnClosed()) {
      await this.natsConn.drain();
    }
  }

  async subscribe(
    channelName: string,
    callback: (message: string) => void,
  ): Promise<void> {
    if (this.isNatsConnClosed()) {
      this.logger.logWarn(`Trying to subscribe without an open nats connection`);
      return;
    }

    const sc = StringCodec();
    const subscription = this.natsConn.subscribe(channelName);

    for await (const message of subscription) {
      const messageContent = sc.decode(message.data);
      this.logger.logInfo(
        `${subscription.getSubject()}: [${subscription.getProcessed()}] : ${messageContent}`,
      );
      callback(messageContent);
    }
  }

  async publish(channelName: string, message: string): Promise<void> {
    if (this.isNatsConnClosed()) {
      this.logger.logWarn(`Trying to publish without an open nats connection`);
      return;
    }

    const sc = StringCodec();
    this.natsConn.publish(channelName, sc.encode(message));
  }

  private isNatsConnClosed(): boolean {
    return !this.natsConn || this.natsConn.isClosed();
  }
 }
