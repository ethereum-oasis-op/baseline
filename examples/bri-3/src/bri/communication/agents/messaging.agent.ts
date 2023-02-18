import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { validate } from 'uuid';
import { LoggingService } from '../../../shared/logging/logging.service';
import { CreateBpiMessageDto } from '../api/dtos/request/createBpiMessage.dto';
import { BpiMessageDto } from '../api/dtos/response/bpiMessage.dto';
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

  public async onNewMessageReceived(rawMessage: string): Promise<void> {
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

      return;
    }

    await this.commandBus.execute(
      new ProcessInboundBpiMessageCommand(
        newBpiMessageCandidate.id,
        newBpiMessageCandidate.from,
        newBpiMessageCandidate.to,
        JSON.stringify(newBpiMessageCandidate.content),
        newBpiMessageCandidate.signature,
        newBpiMessageCandidate.type,
      ),
    );
  }

  public tryDeserializeToBpiMessageCandidate(
    rawMessage: string,
  ): [CreateBpiMessageDto, string[]] {
    const errors: string[] = [];
    let newBpiMessageCandidate: CreateBpiMessageDto; // TODO: Switch to BpiMessage instead of DTO

    try {
      newBpiMessageCandidate = this.parseJsonOrThrow(rawMessage);
    } catch (e) {
      errors.push(`${rawMessage} is not valid JSON. Error: ${e}`);
      return [newBpiMessageCandidate, errors];
    }

    if (!validate(newBpiMessageCandidate.id)) {
      errors.push(`id: ${newBpiMessageCandidate.id} is not a valid UUID`);
    }

    if (!validate(newBpiMessageCandidate.from)) {
      errors.push(`from: ${newBpiMessageCandidate.from} is not a valid UUID`);
    }

    if (!validate(newBpiMessageCandidate.to)) {
      errors.push(`to: ${newBpiMessageCandidate.to} is not a valid UUID`);
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

    if (newBpiMessageCandidate.type !== BpiMessageType.Info) {
      errors.push(`type: ${newBpiMessageCandidate.type} is unknown`);
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
