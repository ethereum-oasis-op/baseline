import { Inject, Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IMessagingClient } from "../messagingClients/messagingClient.interface";

@Injectable()
export class MessagingListenerAgent {

    constructor(
        @Inject('IMessagingClient') private readonly messagingClient: IMessagingClient, 
        private commandBus: CommandBus ) {

        this.messagingClient.subscribe("general", this.onNewMessageReceived)
        this.messagingClient.subscribe("soldier", this.onNewMessageReceived)
    }

    private onNewMessageReceived(message: string): void {
        // TODO: Parse into BPI message
        // TODO: Validate
        // TODO: Dispatch command

        console.log(`New raw message received by MessagingListenerAgent ${message}`);
    }
}