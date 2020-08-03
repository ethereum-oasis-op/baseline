# @baseline-protocol/messaging

Baseline core messaging package.

[NATS](https://nats.io) is currently the default example of a point-to-point messaging provider for organizations to exchange secure protocol messages. Other messaging protocols may be implemented.

## Installation

`npm install @baseline-protocol/messaging`

## Building

You can build the package locally with `npm run build`.

## Interfaces

__IMessagingService__

```
connect(): Promise<any>;
disconnect(): Promise<void>;
getSubscribedSubjects(): string[];
isConnected(): boolean;
publish(subject: string, payload: any, reply?: string, recipientId?: string, senderId?: string): Promise<void>;
request(subject: string, timeout: number, data?: any): Promise<any | void>;
subscribe(subject: string, callback?: (msg: any, err?: any) => void, myId?: string): Promise<any>;
unsubscribe(subject: string);
flush(): Promise<void>;
```

## Supported Providers & Protocols

The following messaging providers are available:

- NATS
- Whisper
