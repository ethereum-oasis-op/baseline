import * as natsutil from "ts-natsutil";
export class NatsClientFacade {
  public static readonly DEFAULT_SCHEME = "wss";
  //public static readonly DEFAULT_HOST = 'provide.services';
  public static readonly DEFAULT_HOST = "localhost:4221";
  public static readonly DEFAULT_PATH = "";
  private readonly bearerToken?: string;
  private readonly natsUrl: string;
  private service?: natsutil.INatsService;
  /**
   * Initialize a convenience wrapper to manage NATS websocket connections.
   *
   * Parameters form a full URI of [scheme]://[host]:[port][path]
   *
   * @param bearerToken  The NATS bearer authorization JWT
   * @param scheme Either 'ws' or 'wss'
   * @param host The domain name or ip address and port of the service
   * @param path The base path
   */
  constructor(
    bearerToken?: string,
    scheme = NatsClientFacade.DEFAULT_SCHEME,
    host = NatsClientFacade.DEFAULT_HOST,
    path?: string
  ) {
    this.bearerToken = bearerToken;
    this.natsUrl = `${scheme}://${host}/${path ? `${path}/` : ""}`;
  }

  //TODO : Need to check the Nats service factory --> NatsService/NatsWS implements INatsService
  public connect(): Promise<any> {
    const service = natsutil.natsServiceFactory({ bearerToken: this.bearerToken, natsServers: [this.natsUrl] });
    return service.connect().then(() => {
      console.log(`NATS connection established to endpoint: ${this.natsUrl}`);
      this.service = service;
    });
  }
  public close() {
    this.service?.disconnect();
  }
  public publish({ subject, payload, reply }): Promise<any> {
    if (!this.service) {
      return Promise.reject(`no NATS service available to publish message on subject: ${subject}`);
    }
    return this.service?.publish(subject, payload, reply);
  }
  public subscribe(subject, onMessage): Promise<any> {
    if (!this.service) {
      return Promise.reject(`no NATS service available to subscribe to subject: ${subject}`);
    }
    return this.service.subscribe(subject, onMessage);
  }
  public unsubscribe(subject: string): void {
    if (!this.service) {
      return;
    }
    this.service.unsubscribe(subject);
  }
  public request({ subject, timeout, payload }): Promise<any> {
    if (!this.service) {
      return Promise.reject(`no NATS service available to send request on subject: ${subject}`);
    }
    return this.service.request(subject, timeout, payload);
  }
}
