import { connect, StringCodec } from "nats";
import { IMessagingClient } from "./messagingClient.interface";

export class NatsMessagingClient implements IMessagingClient {

    constructor() { }

    subscribe(channelName: string, callback: (message: string) => void): void {
        (async () => {
            const sc = StringCodec();
            const nc = await connect({ servers: "localhost:4222" }); // TODO: Read from config
            console.log("Connected NatsMessagingClient to: " + nc.getServer());

            const s1 = nc.subscribe(channelName);

            for await (const m of s1) {
                const messageContent = sc.decode(m.data);
                console.log(`${s1.getSubject()}: [${s1.getProcessed()}] : ${messageContent}`);
                callback(messageContent);
            }
        })();
    }

    publish(channelName: string, message: string): void {
        throw new Error("Method not implemented.");
    }
}