export const messagePayloadTypeJson = 'json';
export const messagePayloadTypeBinary = 'binary';

export interface MessagingService {
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
