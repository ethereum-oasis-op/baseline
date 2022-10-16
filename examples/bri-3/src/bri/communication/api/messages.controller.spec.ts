import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BpiMessageAgent } from '../agents/bpiMessages.agent';
import { CreateBpiMessageCommandHandler } from '../capabilities/createBpiMessage/createBpiMessageCommand.handler';
import { DeleteBpiMessageCommandHandler } from '../capabilities/deleteBpiMessage/deleteBpiMessageCommand.handler';
import { GetBpiMessageByIdQueryHandler } from '../capabilities/getBpiMessageById/getBpiMessageByIdQuery.handler';
import { UpdateBpiMessageCommandHandler } from '../capabilities/updateBpiMessage/updateBpiMessageCommand.handler';
import { BpiMessageStorageAgent } from '../agents/bpiMessagesStorage.agent';
import { MockBpiMessageStorageAgent } from '../agents/mockBpiMessagesStorage.agent';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { MockBpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/mockBpiSubjectStorage.agent';
import { CreateBpiMessageDto } from './dtos/request/createBpiMessage.dto';
import { UpdateBpiMessageDto } from './dtos/request/updateBpiMessage.dto';
import { ID_EMPTY_ERR_MESSAGE, NOT_FOUND_ERR_MESSAGE } from './err.messages';
import Mapper from '../../utils/mapper';
import { MessageController } from './messages.controller';

describe('MessageController', () => {
  let mController: MessageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [MessageController],
      providers: [
        BpiMessageAgent,
        CreateBpiMessageCommandHandler,
        UpdateBpiMessageCommandHandler,
        DeleteBpiMessageCommandHandler,
        GetBpiMessageByIdQueryHandler,
        BpiMessageStorageAgent,
        BpiSubjectStorageAgent,
        Mapper,
      ],
    })
      .overrideProvider(BpiMessageStorageAgent)
      .useValue(new MockBpiMessageStorageAgent(new Mapper()))
      .overrideProvider(BpiSubjectStorageAgent)
      .useValue(new MockBpiSubjectStorageAgent(new Mapper()))
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
        fromId: 'eb6ab5d2-fe0e-4c74-b6e2-343f16eface4',
        toId: 'cf77044d-dd3c-42b6-98dc-5d15ef769eb8',
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
    it('should throw BadRequest if name not provided', () => {
      // Arrange
      const requestDto = {
        id: '123',
        fromId: 'eb6ab5d2-fe0e-4c74-b6e2-343f16eface4',
        toId: 'cf77044d-dd3c-42b6-98dc-5d15ef769eb8',
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      // Act and assert
      expect(async () => {
        await mController.createBpiMessage(requestDto);
      }).rejects.toThrow(new BadRequestException(ID_EMPTY_ERR_MESSAGE));
    });

    it('should return new uuid from the created bpi subject when all params provided', async () => {
      // Arrange
      const requestDto = {
        id: '123',
        fromId: 'eb6ab5d2-fe0e-4c74-b6e2-343f16eface4',
        toId: 'cf77044d-dd3c-42b6-98dc-5d15ef769eb8',
        content: 'hello world',
        signature: 'xyz',
        type: 1,
      } as CreateBpiMessageDto;

      // Act
      const response = await mController.createBpiMessage(requestDto);

      // Assert
      expect(response.length).toEqual(36);
    });
  });

  describe('updateBpiMessage', () => {
    it('should throw NotFound if non existent id passed', () => {
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
        fromId: 'eb6ab5d2-fe0e-4c74-b6e2-343f16eface4',
        toId: 'cf77044d-dd3c-42b6-98dc-5d15ef769eb8',
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
    it('should throw NotFound if non existent id passed', () => {
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
        fromId: 'eb6ab5d2-fe0e-4c74-b6e2-343f16eface4',
        toId: 'cf77044d-dd3c-42b6-98dc-5d15ef769eb8',
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
