export interface IMessagingService {
  connect(): Promise<any>;
  disconnect(): Promise<void>;
  getSubscribedSubjects(): string[];
  isConnected(): boolean;
  publish(subject: string, payload: any, reply?: string): Promise<void>;
  publishCount(): number;
  request(subject: string, timeout: number, data?: any): Promise<any | void>;
  subscribe(subject: string, callback: (msg: any, err?: any) => void): Promise<any>;
  unsubscribe(subject: string);
  flush(): Promise<void>;
}
