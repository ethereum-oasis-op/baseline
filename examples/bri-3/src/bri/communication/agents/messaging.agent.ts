import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { isUuid } from 'uuidv4';
import { LoggingService } from '../../../shared/logging/logging.service';
import { ProcessInboundBpiMessageCommand } from '../capabilities/processInboundMessage/processInboundMessage.command';
import { IMessagingClient } from '../messagingClients/messagingClient.interface';
import { BpiMessage } from '../models/bpiMessage';
import { BpiMessageType } from '../models/bpiMessageType.enum';

@Injectable()
export class MessagingAgent implements OnApplicationBootstrap {
  constructor(
    @Inject('IMessagingClient')
    private readonly messagingClient: IMessagingClient,
    private readonly commandBus: CommandBus,
    private readonly logger: LoggingService,
  ) {}

  async onApplicationBootstrap() {
    this.messagingClient.subscribe(
      'general',
      this.onNewMessageReceived.bind(this),
    );
  }

  async publishMessage(channelName: string, message: string): Promise<void> {
    await this.messagingClient.publish(channelName, message);
  }

  private onNewMessageReceived(rawMessage: string): void {
    this.logger.logInfo(
      `MessagingListenerAgent: New raw message received: ${rawMessage}. Trying to parse into a Bpi Message`,
    );

    const [newBpiMessageCandidate, validationErrors] = this.validateBpiMessageFormat(
      rawMessage,
    );

    if (validationErrors.length > 0) {
      this.logger.logWarn(
        `MessagingListenerAgent: Failed parsing message into Bpi Message. Errors: ${validationErrors.join(
          '; ',
        )}`,
      );

      return;
    }

    this.commandBus.execute(
      new ProcessInboundBpiMessageCommand(newBpiMessageCandidate),
    );
  }

  private validateBpiMessageFormat(rawMessage: string): [BpiMessage, string[]] {
    const errors: string[] = [];
    let newBpiMessageCandidate: BpiMessage;

    try {
      newBpiMessageCandidate = JSON.parse(rawMessage) // TODO: Make it more robust (i.e JSON.parse(123) does not throw)
    } catch (e) {
      errors.push(`${rawMessage} is not valid JSON. Error: ${e}`);
      return [newBpiMessageCandidate, errors];
    }
    
    if (!isUuid(newBpiMessageCandidate.id)) {
      errors.push('id is not a valid UUID');
    }

    if (!isUuid(newBpiMessageCandidate.fromBpiSubjectId)) {
      errors.push('fromBpiSubjectId is not a valid UUID');
    }

    if (!isUuid(newBpiMessageCandidate.toBpiSubjectId)) {
      errors.push('toBpiSubjectId is not a valid UUID');
    }

    try {
      JSON.parse(newBpiMessageCandidate.content); // TODO: Make it more robust (i.e JSON.parse(123) does not throw)
    } catch (e) {
      errors.push(`content: ${newBpiMessageCandidate.content} is not valid JSON. Error: ${e}`);
    }

    if (!newBpiMessageCandidate.signature || newBpiMessageCandidate.signature.length === 0) {
      errors.push('signature is empty');
    }

    if (
      newBpiMessageCandidate.type !== BpiMessageType.MessageType1 &&
      newBpiMessageCandidate.type !== BpiMessageType.MessageType2
    ) {
      errors.push(`type is unknown ${newBpiMessageCandidate.type}`);
    }

    return [newBpiMessageCandidate, errors];
  }
}
