import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingModule } from '../../../shared/logging/logging.module';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { NOT_FOUND_ERR_MESSAGE as BPI_SUBJECT_NOT_FOUND_ERR_MESSAGE } from '../../identity/bpiSubjects/api/err.messages';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { SubjectsProfile } from '../../identity/bpiSubjects/subjects.profile';
import { BpiMessageAgent } from '../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../agents/bpiMessagesStorage.agent';
import { MessagingAgent } from '../agents/messaging.agent';
import { MockBpiMessageStorageAgent } from '../agents/mockBpiMessagesStorage.agent';
import { CreateBpiMessageCommandHandler } from '../capabilities/createBpiMessage/createBpiMessageCommand.handler';
import { DeleteBpiMessageCommandHandler } from '../capabilities/deleteBpiMessage/deleteBpiMessageCommand.handler';
import { GetBpiMessageByIdQueryHandler } from '../capabilities/getBpiMessageById/getBpiMessageByIdQuery.handler';
import { UpdateBpiMessageCommandHandler } from '../capabilities/updateBpiMessage/updateBpiMessageCommand.handler';
import { CommunicationModule } from '../communication.module';
import { CommunicationProfile } from '../communicaton.profile';
import { NatsMessagingClient } from '../messagingClients/natsMessagingClient';
import { BpiMessage } from '../models/bpiMessage';
import { CreateBpiMessageDto } from './dtos/request/createBpiMessage.dto';
import { UpdateBpiMessageDto } from './dtos/request/updateBpiMessage.dto';
import {
  BPI_MESSAGE_ALREADY_EXISTS,
  NOT_FOUND_ERR_MESSAGE,
} from './err.messages';
import { MessageController } from './messages.controller';

describe('MessageController', () => {
  let mController: MessageController;
  let mockBpiMessageStorageAgent: MockBpiMessageStorageAgent;
  let mockBpiSubjectStorageAgent: MockBpiSubjectStorageAgent;
  let existingBpiSubject1: BpiSubject;
  let existingBpiSubject2: BpiSubject;
  let existingBpiMessage: BpiMessage;

  beforeEach(async () => {
    mockBpiMessageStorageAgent = new MockBpiMessageStorageAgent();
    mockBpiSubjectStorageAgent = new MockBpiSubjectStorageAgent();
    existingBpiSubject1 = await mockBpiSubjectStorageAgent.createNewBpiSubject(
      new BpiSubject('', 'name', 'desc', 'xyz', []),
    );
    existingBpiSubject2 = await mockBpiSubjectStorageAgent.createNewBpiSubject(
      new BpiSubject('', 'name2', 'desc2', 'xyz2', []),
    );

    existingBpiMessage = await mockBpiMessageStorageAgent.storeNewBpiMessage(
      new BpiMessage(
        'f3e4295d-6a2a-4f04-8477-02f781eb93f8',
        existingBpiSubject1,
        existingBpiSubject2,
        'hello world',
        'xyz',
        0,
      ),
    );

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        CommunicationModule,
        LoggingModule,
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      controllers: [MessageController],
      providers: [
        BpiMessageAgent,
        CreateBpiMessageCommandHandler,
        UpdateBpiMessageCommandHandler,
        DeleteBpiMessageCommandHandler,
        GetBpiMessageByIdQueryHandler,
        BpiMessageStorageAgent,
        BpiSubjectStorageAgent,
        MessagingAgent,
        {
          provide: 'IMessagingClient',
          useClass: NatsMessagingClient,
        },
        SubjectsProfile,
        CommunicationProfile,
      ],
    })
      .overrideProvider(BpiMessageStorageAgent)
      .useValue(mockBpiMessageStorageAgent)
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockBpiSubjectStorageAgent)
      .compile();

    mController = app.get<MessageController>(MessageController);

    await app.init();
  });

  describe('getBpiMessageById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';

      // Act and assert
      expect(async () => {
        await mController.getBpiMessageById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct bpi subject if proper id passed ', async () => {
      // Arrange
      const requestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      const newBpiMessageId = await mController.createBpiMessage(requestDto);

      // Act
      const createdBpiMessage = await mController.getBpiMessageById(
        newBpiMessageId,
      );

      // Assert
      expect(createdBpiMessage.id).toEqual(newBpiMessageId);
      expect(createdBpiMessage.content).toEqual(requestDto.content);
      expect(createdBpiMessage.signature).toEqual(requestDto.signature);
      expect(createdBpiMessage.type).toEqual(requestDto.type);
    });
  });

  describe('createBpiMessage', () => {
    it('should throw BadRequest if existing bpi message id provided in id field', () => {
      // Arrange
      const requestDto = {
        id: existingBpiMessage.id,
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      // Act and assert
      expect(async () => {
        await mController.createBpiMessage(requestDto);
      }).rejects.toThrow(
        new BadRequestException(BPI_MESSAGE_ALREADY_EXISTS(requestDto.id)),
      );
    });

    it('should throw BadRequest non existent bpi subject id provided in from field', () => {
      // Arrange
      const requestDto = {
        id: '123',
        from: 'nonexistent',
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      // Act and assert
      expect(async () => {
        await mController.createBpiMessage(requestDto);
      }).rejects.toThrow(
        new BadRequestException(BPI_SUBJECT_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should return new uuid from the created bpi subject when all params provided', async () => {
      // Arrange
      const requestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      // Act
      const response = await mController.createBpiMessage(requestDto);

      // Assert
      expect(response).toEqual(requestDto.id);
    });
  });

  describe('updateBpiMessage', () => {
    it('should throw NotFound if non existent id passed', async () => {
      // Arrange
      const nonExistentId = '123';

      const requestDto = {
        content: 'this is content',
        signature: 'xyz',
      } as UpdateBpiMessageDto;

      // Act and assert
      expect(async () => {
        await mController.updateBpiMessage(nonExistentId, requestDto);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the update if existing id passed', async () => {
      // Arrange
      const createRequestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      const newBpiMessageId = await mController.createBpiMessage(
        createRequestDto,
      );

      const updateRequestDto = {
        content: 'this is content2',
        signature: 'xyz2',
      } as UpdateBpiMessageDto;

      // Act
      await mController.updateBpiMessage(newBpiMessageId, updateRequestDto);

      // Assert
      const updatedBpiMessage = await mController.getBpiMessageById(
        newBpiMessageId,
      );

      expect(updatedBpiMessage.id).toEqual(newBpiMessageId);
      expect(updatedBpiMessage.content).toEqual(updateRequestDto.content);
      expect(updatedBpiMessage.signature).toEqual(updateRequestDto.signature);
    });
  });

  describe('deleteBpiMessage', () => {
    it('should throw NotFound if non existent id passed', async () => {
      // Arrange
      const nonExistentId = '123';
      // Act and assert
      expect(async () => {
        await mController.deleteBpiMessage(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      const createRequestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      const newBpiMessageId = await mController.createBpiMessage(
        createRequestDto,
      );

      // Act
      await mController.deleteBpiMessage(newBpiMessageId);

      // Assert
      expect(async () => {
        await mController.getBpiMessageById(newBpiMessageId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });
  });
});
