import { NatsOptions, Transport } from '@nestjs/microservices';

export const natsConfig: NatsOptions = {
  transport: Transport.NATS,
  options: {
    url: process.env.NATS_URL || 'nats://localhost:4222',
  },
};