import { natsServiceFactory } from './providers/nats';
import { WhisperService, getWeb3 } from './providers/whisper';

export const messagePayloadTypeJson = 'json';
export const messagePayloadTypeBinary = 'binary';

export const messagingProviderNats = 'nats';
export const messagingProviderWhisper = 'whisper';

export interface IMessagingService {
  connect(): Promise<any>;
  disconnect(): Promise<void>;
  getSubscribedSubjects(): string[];
  isConnected(): boolean;
  publish(subject: string, payload: any, reply?: string): Promise<void>;
  request(subject: string, timeout: number, data?: any): Promise<any | void>;
  subscribe(subject: string, callback: (msg: any, err?: any) => void): Promise<any>;
  unsubscribe(subject: string);
  flush(): Promise<void>;
}

export async function messagingClientFactory(
  provider: string,
  config?: any,
): Promise<IMessagingService> {
  let messenger;

  switch (provider) {
    case messagingProviderWhisper:
      messenger = await new WhisperService();
      await messenger.loadIdentities();
      await messenger.createFirstIdentity();
      await getWeb3();
      break;
    case messagingProviderNats:
      messenger = await natsServiceFactory(config);
      break;
    default:
      throw new Error('messaging type configuration required');
  }

  return messenger;
}
