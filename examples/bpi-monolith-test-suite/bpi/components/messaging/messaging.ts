import { BpiMessage } from "../../bpiMessage";
import { BpiSubject } from "../../bpiSubject";
import { IMessagingComponent } from "./messaging.interface";

export class MockMessagingComponent implements IMessagingComponent {
    messages: BpiMessage[] = [];
    
    sendMessageToCounterParty(message: BpiMessage): void {
        this.messages.push(message);
    }

    getNewvlyReceivedMessages(subject: BpiSubject): BpiMessage[] {
        return this.messages.filter(msg => msg.receiver.id == subject.id);
    }
}