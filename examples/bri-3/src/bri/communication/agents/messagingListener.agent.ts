import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { LoggingService } from "src/shared/logging/logging.service";
import { ProcessInboundMessageCommand } from "../capabilities/processInboundMessage/processInboundMessage.command";
import { IMessagingClient } from "../messagingClients/messagingClient.interface";

@Injectable()
export class MessagingListenerAgent implements OnModuleInit {

    constructor(
        @Inject('IMessagingClient') private readonly messagingClient: IMessagingClient, 
        private commandBus: CommandBus,
        private log: LoggingService) {
    }
    
    async onModuleInit() {
        this.messagingClient.subscribe("general", this.onNewMessageReceived.bind(this));
        this.messagingClient.subscribe("soldier", this.onNewMessageReceived.bind(this));
    }

    private onNewMessageReceived(message: string): void {
        // TODO: Could we make this log service implicitly print the caller class?
        this.log.logInfo(`MessagingListenerAgent: New raw message received: ${message}. Disptaching ProcessInboundMessageCommand`);
        this.commandBus.execute(new ProcessInboundMessageCommand(message));
    }
}