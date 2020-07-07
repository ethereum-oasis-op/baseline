export interface NatsConfig {
  clusterId?: string;
  options?: any;
  servers: string | string[];
  token?: string;
}
