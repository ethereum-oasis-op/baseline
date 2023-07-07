import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionModule } from '../../../shared/encryption/encryption.module';
import { LoggingModule } from '../../../shared/logging/logging.module';
import { INVALID_SIGNATURE } from '../../auth/api/err.messages';
import { AuthModule } from '../../auth/auth.module';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { NOT_FOUND_ERR_MESSAGE as BPI_SUBJECT_NOT_FOUND_ERR_MESSAGE } from '../../identity/bpiSubjects/api/err.messages';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { SubjectsProfile } from '../../identity/bpiSubjects/subjects.profile';
import { BpiMessageAgent } from '../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../agents/bpiMessagesStorage.agent';
import { MessagingAgent } from '../agents/messaging.agent';
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
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('MessageController', () => {
  let mController: MessageController;
  let messageStorageAgentMock: DeepMockProxy<BpiMessageStorageAgent>;
  let subjectStorageAgentMock: DeepMockProxy<BpiSubjectStorageAgent>;
  let existingBpiSubject1: BpiSubject;
  let existingBpiSubject2: BpiSubject;
  let existingBpiMessage: BpiMessage;

  beforeAll(() => {
    process.env.BPI_ENCRYPTION_KEY_K_PARAM =
      'yzkXp3vY_AZQ3YfLv9GMRTYkjUOpn9x18gPkoFvoUxQ';
    process.env.BPI_ENCRYPTION_KEY_KTY_PARAM = 'oct';
  });

  beforeEach(async () => {
    existingBpiSubject1 = new BpiSubject(
      '',
      'name',
      'desc',
      '0x08872e27BC5d78F1FC4590803369492868A1FCCb',
      [],
    );
    existingBpiSubject2 = new BpiSubject(
      '',
      'name2',
      'desc2',
      '0xF58e44db895C0fa1ca97d68E2F9123B187b789d4',
      [],
    );

    existingBpiMessage = new BpiMessage(
      'f3e4295d-6a2a-4f04-8477-02f781eb93f8',
      existingBpiSubject1.id,
      existingBpiSubject2.id,
      'hello world',
      'xyz',
      0,
    );

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CqrsModule,
        AuthModule,
        CommunicationModule,
        LoggingModule,
        EncryptionModule,
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
      .useValue(mockDeep<BpiMessageStorageAgent>())
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(mockDeep<BpiSubjectStorageAgent>())
      .compile();

    mController = app.get<MessageController>(MessageController);
    messageStorageAgentMock = app.get(BpiMessageStorageAgent);
    subjectStorageAgentMock = app.get(BpiSubjectStorageAgent);

    await app.init();
  });

  describe('getBpiMessageById', () => {
    it('should throw NotFound if non existent id passed', () => {
      // Arrange
      const nonExistentId = '123';
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        undefined,
      );

      // Act and assert
      expect(async () => {
        await mController.getBpiMessageById(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should return the correct bpi message if proper id passed ', async () => {
      // Arrange
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        existingBpiMessage,
      );

      // Act
      const fetchedBpiMessage = await mController.getBpiMessageById(
        existingBpiMessage.id,
      );

      // Assert
      expect(fetchedBpiMessage.id).toEqual(existingBpiMessage.id);
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
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        existingBpiMessage,
      );

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
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValue(undefined);

      // Act and assert
      expect(async () => {
        await mController.createBpiMessage(requestDto);
      }).rejects.toThrow(
        new BadRequestException(BPI_SUBJECT_NOT_FOUND_ERR_MESSAGE),
      );
    });

    it('should throw Unauthorized if signature with invalid format provided', () => {
      // Arrange
      const requestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature: 'invalid format signature',
        type: 1,
      } as CreateBpiMessageDto;
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValueOnce(
        existingBpiSubject1,
      );
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValueOnce(
        existingBpiSubject2,
      );

      // Act and assert
      expect(async () => {
        await mController.createBpiMessage(requestDto);
      }).rejects.toThrow(new UnauthorizedException(INVALID_SIGNATURE));
    });

    it('should throw Unauthorized if signature with valid format that does not fit with the public key of the sender is provided', () => {
      // Arrange
      const requestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature:
          '0xb377f459b07873ed407c3d1a4904051f3384e02906a7ca0abd5bfe7b3349ee71194179801ad449c118281bd4772cfe3f272455f86ae8dfae59a5c00c1d762d2b1b',
        type: 1,
      } as CreateBpiMessageDto;
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValueOnce(
        existingBpiSubject1,
      );
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValueOnce(
        existingBpiSubject2,
      );

      // Act and assert
      expect(async () => {
        await mController.createBpiMessage(requestDto);
      }).rejects.toThrow(new UnauthorizedException(INVALID_SIGNATURE));
    });

    it('should return new uuid from the created bpi subject when all params provided', async () => {
      // Arrange
      const requestDto = {
        id: '123',
        from: existingBpiSubject1.id,
        to: existingBpiSubject2.id,
        content: 'hello world',
        signature:
          '0xb27e0845a034ae61be153bf305985e4c66e9e0b0009289c764eceeb9d886a33b435cef57834b078c3eca85e015374c6f8e1406c3ac6b13144a98f794ba7c56ce1c',
        type: 1,
      } as CreateBpiMessageDto;
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValueOnce(
        existingBpiSubject1,
      );
      subjectStorageAgentMock.getBpiSubjectById.mockResolvedValueOnce(
        existingBpiSubject2,
      );

      const expectedBpiMessage = new BpiMessage(
        requestDto.id,
        existingBpiSubject1.id,
        existingBpiSubject2.id,
        requestDto.content,
        requestDto.signature,
        requestDto.type,
      );
      messageStorageAgentMock.storeNewBpiMessage.mockResolvedValueOnce(
        expectedBpiMessage,
      );

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
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        undefined,
      );

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
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        existingBpiMessage,
      );

      const updateRequestDto = {
        content: 'this is content2',
        signature: 'xyz2',
      } as UpdateBpiMessageDto;
      messageStorageAgentMock.updateBpiMessage.mockResolvedValueOnce({
        ...existingBpiMessage,
        content: updateRequestDto.content,
        signature: updateRequestDto.signature,
      } as BpiMessage);

      // Act
      const updatedBpiMessage = await mController.updateBpiMessage(
        existingBpiMessage.id,
        updateRequestDto,
      );

      // Assert
      expect(updatedBpiMessage.id).toEqual(existingBpiMessage.id);
      expect(updatedBpiMessage.content).toEqual(updateRequestDto.content);
      expect(updatedBpiMessage.signature).toEqual(updateRequestDto.signature);
    });
  });

  describe('deleteBpiMessage', () => {
    it('should throw NotFound if non existent id passed', async () => {
      // Arrange
      const nonExistentId = '123';
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        undefined,
      );

      // Act and assert
      expect(async () => {
        await mController.deleteBpiMessage(nonExistentId);
      }).rejects.toThrow(new NotFoundException(NOT_FOUND_ERR_MESSAGE));
    });

    it('should perform the delete if existing id passed', async () => {
      // Arrange
      messageStorageAgentMock.getBpiMessageById.mockResolvedValueOnce(
        existingBpiMessage,
      );

      // Act
      await mController.deleteBpiMessage(existingBpiMessage.id);
    });
  });
});
