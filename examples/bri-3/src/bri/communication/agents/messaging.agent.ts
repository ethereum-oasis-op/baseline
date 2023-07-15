import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { validate } from 'uuid';
import { LoggingService } from '../../../shared/logging/logging.service';
import { ProcessInboundBpiTransactionCommand } from '../../transactions/capabilities/processInboundTransaction/processInboundTransaction.command';
import { BpiMessageDto } from '../api/dtos/response/bpiMessage.dto';
import { ProcessInboundBpiMessageCommand } from '../capabilities/processInboundMessage/processInboundMessage.command';
import { IMessagingClient } from '../messagingClients/messagingClient.interface';
import { BpiMessage } from '../models/bpiMessage';

@Injectable()
export class MessagingAgent implements OnApplicationBootstrap {
  constructor(
    @Inject('IMessagingClient')
    private readonly messagingClient: IMessagingClient,
    private readonly commandBus: CommandBus,
    @InjectMapper() private mapper: Mapper,
    private readonly logger: LoggingService,
  ) {}

  async onApplicationBootstrap() {
    this.messagingClient.subscribe(
      'general',
      this.onNewMessageReceived.bind(this),
    );
  }

  public async publishMessage(
    channelName: string,
    message: string,
  ): Promise<void> {
    await this.messagingClient.publish(channelName, message);
  }

  // TODO: Add unit tests for this method
  public async onNewMessageReceived(rawMessage: string): Promise<boolean> {
    this.logger.logInfo(
      `MessagingListenerAgent: New raw message received: ${rawMessage}. Trying to parse into a Bpi Message`,
    );

    const [newBpiMessageCandidate, validationErrors] =
      this.tryDeserializeToBpiMessageCandidate(rawMessage);

    if (validationErrors.length > 0) {
      this.logger.logError(
        `MessagingListenerAgent: Failed parsing message into Bpi Message. Errors: ${validationErrors.join(
          '; ',
        )}`,
      );

      return false;
    }

    if (newBpiMessageCandidate.isInfoMessage()) {
      return await this.commandBus.execute(
        new ProcessInboundBpiMessageCommand(
          newBpiMessageCandidate.id,
          newBpiMessageCandidate.fromBpiSubjectId,
          newBpiMessageCandidate.toBpiSubjectId,
          JSON.stringify(newBpiMessageCandidate.content),
          newBpiMessageCandidate.signature,
          newBpiMessageCandidate.type,
        ),
      );
    }

    if (newBpiMessageCandidate.isTransactionMessage()) {
      return await this.commandBus.execute(
        new ProcessInboundBpiTransactionCommand(
          newBpiMessageCandidate.id,
          1, // TODO: #669 Nonce
          'TODO: #669 workflowInstanceId',
          'TODO: #669 workstepInstanceId',
          'TODO: #669 fromBpiSubjectAccountId',
          'TODO: #669 toBpiSubjectAccountId',
          JSON.stringify(newBpiMessageCandidate.content),
          newBpiMessageCandidate.signature,
        ),
      );
    }

    return false;
  }

  public tryDeserializeToBpiMessageCandidate(
    rawMessage: string,
  ): [BpiMessage, string[]] {
    const errors: string[] = [];
    let newBpiMessageCandidate: BpiMessage = {} as BpiMessage;

    try {
      const newBpiMessageProps = this.parseJsonOrThrow(rawMessage);
      newBpiMessageCandidate = new BpiMessage(
        newBpiMessageProps.id,
        newBpiMessageProps.fromBpiSubjectId,
        newBpiMessageProps.toBpiSubjectId,
        newBpiMessageProps.content,
        newBpiMessageProps.signature,
        newBpiMessageProps.type,
      );
    } catch (e) {
      errors.push(`${rawMessage} is not valid JSON. Error: ${e}`);
      return [newBpiMessageCandidate, errors];
    }

    if (
      !newBpiMessageCandidate.isInfoMessage() &&
      !newBpiMessageCandidate.isTransactionMessage()
    ) {
      errors.push(`type: ${newBpiMessageCandidate.type} is unknown`);
      return [newBpiMessageCandidate, errors];
    }

    if (!validate(newBpiMessageCandidate.id)) {
      errors.push(`id: ${newBpiMessageCandidate.id} is not a valid UUID`);
    }

    if (!validate(newBpiMessageCandidate.fromBpiSubjectId)) {
      errors.push(
        `from: ${newBpiMessageCandidate.fromBpiSubjectId} is not a valid UUID`,
      );
    }

    if (!validate(newBpiMessageCandidate.toBpiSubjectId)) {
      errors.push(
        `to: ${newBpiMessageCandidate.toBpiSubjectId} is not a valid UUID`,
      );
    }

    if (
      !newBpiMessageCandidate.content ||
      typeof newBpiMessageCandidate.content !== 'object'
    ) {
      errors.push(
        `content: ${newBpiMessageCandidate.content} is not valid JSON.`,
      );
    }

    if (
      !newBpiMessageCandidate.signature ||
      newBpiMessageCandidate.signature.length === 0
    ) {
      errors.push('signature is empty');
    }

    if (newBpiMessageCandidate.isTransactionMessage()) {
      // TODO: Perform additional transaction specific validation once #669 is done
    }

    return [newBpiMessageCandidate, errors];
  }

  public serializeBpiMessage(bpiMessage: BpiMessage): string {
    const bpiMessageDto = this.mapper.map(
      bpiMessage,
      BpiMessage,
      BpiMessageDto,
    );
    return JSON.stringify(bpiMessageDto);
  }

  private parseJsonOrThrow(jsonString: string) {
    // https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
    const o = JSON.parse(jsonString);

    if (o && typeof o === 'object') {
      return o;
    }

    throw new Error(
      `String ${jsonString} is a valid JSON primitive but not a proper JSON document.`,
    );
  }
}
