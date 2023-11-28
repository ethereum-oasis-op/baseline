import { natsServiceFactory } from './providers/nats';
import { WhisperService } from './providers/whisper';

export const messagePayloadTypeJson = 'json';
export const messagePayloadTypeBinary = 'binary';

export const messagingProviderNats = 'nats';
export const messagingProviderWhisper = 'whisper';

export interface IMessagingService {
  connect(): Promise<any>;
  disconnect(): Promise<void>;
  getSubscribedSubjects(): string[];
  isConnected(): boolean;
  publish(subject: string, payload: any, reply?: string, recipientId?: string, senderId?: string): Promise<void>;
  request(subject: string, timeout: number, data?: any): Promise<any | void>;
  subscribe(subject: string, callback?: (msg: any, err?: any) => void, myId?: string): Promise<any>;
  unsubscribe(subject: string);
  flush(): Promise<void>;
}

export async function messagingServiceFactory(
  provider: string,
  config?: any,
): Promise<IMessagingService> {
  let service;

  switch (provider) {
    case messagingProviderWhisper:
      service = await new WhisperService(config);
      break;
    case messagingProviderNats:
      service = await natsServiceFactory(config);
      break;
    default:
      throw new Error('messaging service provider required');
  }

  return service;
}
