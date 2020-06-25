import { natsServiceFactory, INatsService } from 'ts-natsutil';
import { NatsConfig } from './config';
import { IMessagingService } from '../..';

export class NatsService implements IMessagingService {

  private service?: INatsService | null;
  private bearerToken: string | null;

  constructor(
    private readonly config: NatsConfig,
    private readonly getBearerToken: () => Promise<string>, // TODO
  ) {
    this.bearerToken = null;
  }

  getSubscribedSubjects(): string[] {
    throw new Error('Method not implemented.');
  }

  async connect(): Promise<void> {
    if (!this.bearerToken && this.getBearerToken) {
      this.bearerToken = await this.getBearerToken();
    }

    const servers = this.config.servers;
    const service = natsServiceFactory({
      bearerToken: this.bearerToken,
      natsServers: typeof servers === `string` ? [servers] : servers,
    });

    const natsConnection = await service.connect();
    this.service = service;
    const self = this;
    if (typeof natsConnection.addEventListener === 'function') {
      natsConnection.addEventListener('close', async () => {
        this.bearerToken = null;
        await self.connect();
      });
    } else {
      natsConnection.on('close', async () => {
        this.bearerToken = null;
        await self.connect();
      });
    }
  }

  disconnect(): Promise<void> {
    if (this.service?.isConnected()) {
      this.service!.disconnect();
      this.service = null;
    }
    return Promise.resolve();
  }

  isConnected(): boolean {
    return this.service !== null;
  }

  async publish(subject: string, data: any): Promise<void> {
    this.service!.publish(subject, data);
  }

  async request(subject: string, timeout: number, data: object = {}): Promise<any> {
    const response = await this.service!.request(subject, timeout, data);
    return response;
  }

  async subscribe(
    subject: string,
    callback: (msg: any, err?: any) => void,
  ): Promise<void> {
    await this.service!.subscribe(subject, (msg: any, err?: any): void => {
      callback(msg, err);
    });
  }

  async unsubscribe(subject: string): Promise<void> {
    const unsubscribeFrom = this.getSubjectsToUnsubscribeFrom(subject);
    unsubscribeFrom.forEach(sub => {
      this.service!.unsubscribe(sub);
    });
  }

  async flush(): Promise<void> {
    await this.service!.flush();
  }

  private getSubjectsToUnsubscribeFrom(subject: string): string[] {
    const subscribedTo = this.service!.getSubscribedSubjects();
    const unsubscribeFrom: string[] = [];

    // account for wildcards
    const substrsToMatch = subject.split(`>`)[0].split(`*`);
    subscribedTo.forEach(subscribedSubject => {
      let subjectIncludesAllSubstrings = true;
      substrsToMatch.forEach(match => {
        if (!subscribedSubject.includes(match) && match !== ``) {
          subjectIncludesAllSubstrings = false;
        }
      });
      if (subjectIncludesAllSubstrings) {
        unsubscribeFrom.push(subscribedSubject);
      }
    });

    return unsubscribeFrom;
  }
}
