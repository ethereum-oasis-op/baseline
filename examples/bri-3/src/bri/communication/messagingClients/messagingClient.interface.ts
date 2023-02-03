export interface IMessagingClient {
    subscribe(channelName: string, callback: (message: string) => void): void;
    publish(channelName: string, message: string): void;
}