export interface IMessagingClient {
  subscribe(
    channelName: string,
    callback: (message: string) => void,
  ): Promise<void>;
  publish(channelName: string, message: string): Promise<void>;
}
