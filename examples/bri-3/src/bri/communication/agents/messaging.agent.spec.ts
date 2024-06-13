import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { BpiMessageType } from '../models/bpiMessageType.enum';
import { MessagingAgent } from './messaging.agent';
import { IMessagingClient } from '../messagingClients/messagingClient.interface';
import { CommandBus } from '@nestjs/cqrs';
import { Mapper } from '@automapper/core';
import { LoggingService } from 'src/shared/logging/logging.service';

let messagingAgent: MessagingAgent;

const messagingClientMock: DeepMockProxy<IMessagingClient> =
  mockDeep<IMessagingClient>();

const commandBusMock: DeepMockProxy<CommandBus> = mockDeep<CommandBus>();
const mapperMock: DeepMockProxy<Mapper> = mockDeep<Mapper>();
const loggingServiceMock: DeepMockProxy<LoggingService> =
  mockDeep<LoggingService>();

beforeAll(async () => {
  messagingAgent = new MessagingAgent(
    messagingClientMock,
    commandBusMock,
    mapperMock,
    loggingServiceMock,
  );
});

describe('Messaging Agent', () => {
  it('Should return error when validating incorrect JSON raw message', () => {
    // Arrange
    const rawMessage = 'test';

    // Act
    const [resultDto, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual(
      'test is not valid JSON. Error: SyntaxError: Unexpected token e in JSON at position 1',
    );
  });

  it('Should return error when validating correct JSON raw message with invalid UUID in id field', () => {
    // Arrange
    const rawMessage =
      '{ "id": "pakakoto", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 0}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('id: pakakoto is not a valid UUID');
  });

  it('Should return error when validating correct JSON raw message with invalid UUID in from field', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "7123", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 0}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('from: 7123 is not a valid UUID');
  });

  it('Should return error when validating correct JSON raw message with invalid UUID in to field', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "msm24", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 0}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('to: msm24 is not a valid UUID');
  });

  it('Should return error when validating correct JSON raw message with content field not valid JSON', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": 123, "signature": "xyz", "type": 0}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('content: 123 is not valid JSON.');
  });

  it('Should return error when validating correct JSON raw message with signature field empty', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "", "type": 0}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('signature is empty');
  });

  it('Should return error when validating correct JSON raw message with message type not being known', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 999}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('type: 999 is unknown');
  });

  it('Should return no errors and create message dto when validating correct JSON raw message of INFO type', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 0}';

    // Act
    const [resultDto, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(0);
    expect(resultDto).toBeDefined();
    expect(resultDto?.id).toEqual('0a3dd67c-c031-4b50-95df-0bc5fc1c78b5');
    expect(resultDto?.fromBpiSubjectId).toEqual(
      '71302cec-0a38-469a-a4e5-f58bdfc4ab32',
    );
    expect(resultDto?.toBpiSubjectId).toEqual(
      '76cdd901-d87d-4c87-b572-155afe45c128',
    );
    expect(resultDto?.content).toEqual({ testProp: 'testValue' });
    expect(resultDto?.signature).toEqual('xyz');
    expect(resultDto?.type).toEqual(BpiMessageType.Info);
  });

  it('Should return no errors and create message dto when validating correct JSON raw message of TRANSACTION type', () => {
    // Arrange
    const rawMessage = `{ 
          "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", 
          "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32",
          "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128",
          "fromBpiSubjectAccountId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32",
          "toBpiSubjectAccountId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32",
          "workflowId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32",
          "workstepId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32",
          "content": { "testProp":"testValue" }, 
          "signature": "xyz", 
          "type": 1
        }`;

    // Act
    const [resultDto, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(0);
    expect(resultDto).toBeDefined();
    expect(resultDto?.id).toEqual('0a3dd67c-c031-4b50-95df-0bc5fc1c78b5');
    expect(resultDto?.fromBpiSubjectId).toEqual(
      '71302cec-0a38-469a-a4e5-f58bdfc4ab32',
    );
    expect(resultDto?.toBpiSubjectId).toEqual(
      '76cdd901-d87d-4c87-b572-155afe45c128',
    );
    expect(resultDto?.content).toEqual({ testProp: 'testValue' });
    expect(resultDto?.signature).toEqual('xyz');
    expect(resultDto?.type).toEqual(BpiMessageType.Transaction);
  });
});
