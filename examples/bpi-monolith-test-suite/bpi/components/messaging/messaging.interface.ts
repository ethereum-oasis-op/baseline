import { BpiMessage } from "../../bpiMessage";
import { BpiSubject } from "../../bpiSubject";

export interface IMessagingComponent {
    sendMessageToCounterParty(message: BpiMessage): void;
    getNewvlyReceivedMessages(subject: BpiSubject): BpiMessage[];
}