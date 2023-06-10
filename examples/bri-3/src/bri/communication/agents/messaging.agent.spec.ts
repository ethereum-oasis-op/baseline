import { MessagingAgent } from './messaging.agent';

let messagingAgent: MessagingAgent;

beforeAll(async () => {
  messagingAgent = new MessagingAgent(null, null, null, null);
});

describe('Messaging Agent', () => {
  it('Should return error when validating incorrect JSON raw message', () => {
    // Arrange
    const rawMessage = 'test';

    // Act
    const [resultDto, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(resultDto).toBeUndefined();
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual(
      `test is not valid JSON. Error: SyntaxError: Unexpected token 'e', \"test\" is not valid JSON`,
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

  it('Should return error when validating correct JSON raw message with message type not being info', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 1}';

    // Act
    const [, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0]).toEqual('type: 1 is unknown');
  });

  it('Should return no errors and create message dto when validating correct JSON raw message', () => {
    // Arrange
    const rawMessage =
      '{ "id": "0a3dd67c-c031-4b50-95df-0bc5fc1c78b5", "fromBpiSubjectId": "71302cec-0a38-469a-a4e5-f58bdfc4ab32", "toBpiSubjectId": "76cdd901-d87d-4c87-b572-155afe45c128", "content": { "testProp":"testValue" }, "signature": "xyz", "type": 0}';

    // Act
    const [resultDto, validationErrors] =
      messagingAgent.tryDeserializeToBpiMessageCandidate(rawMessage);

    // Assert
    expect(validationErrors.length).toBe(0);
    expect(resultDto).toBeDefined();
    expect(resultDto.id).toEqual('0a3dd67c-c031-4b50-95df-0bc5fc1c78b5');
    expect(resultDto.fromBpiSubjectId).toEqual(
      '71302cec-0a38-469a-a4e5-f58bdfc4ab32',
    );
    expect(resultDto.toBpiSubjectId).toEqual(
      '76cdd901-d87d-4c87-b572-155afe45c128',
    );
    expect(resultDto.content).toEqual({ testProp: 'testValue' });
    expect(resultDto.signature).toEqual('xyz');
    expect(resultDto.type).toEqual(0);
  });
});
