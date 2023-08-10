import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  SHOULD_BE_OF_TYPE_NUMBER,
  SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
} from '../../../../shared/constants';
import { CreateBpiMessageDto } from './createBpiMessage.dto';

describe('CreateBpiMessageDto', () => {
  it('should return error in case id not provided.', async () => {
    // Arrange
    const dto = {
      from: '1',
      to: '2',
      content: 'hello world',
      signature: 'xyz',
      type: 1,
    };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('id');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'id ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case from not provided.', async () => {
    // Arrange
    const dto = {
      id: '1',
      to: '2',
      content: 'hello world',
      signature: 'xyz',
      type: 1,
    };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('from');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'from ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case to not provided.', async () => {
    // Arrange
    const dto = {
      id: '1',
      from: '1',
      content: 'hello world',
      signature: 'xyz',
      type: 1,
    };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('to');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'to ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case content not provided.', async () => {
    // Arrange
    const dto = { id: '1', from: '1', to: '2', signature: 'xyz', type: 1 };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('content');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'content ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case signature not provided.', async () => {
    // Arrange
    const dto = {
      id: '1',
      from: '1',
      to: '2',
      content: 'hello world',
      type: 1,
    };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('signature');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'signature ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case type not provided.', async () => {
    // Arrange
    const dto = {
      id: '1',
      from: '1',
      to: '2',
      content: 'hello world',
      signature: 'xyz',
    };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('type');
    expect(errors[0].constraints?.isNotEmpty).toContain(
      'type ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case type not a number.', async () => {
    // Arrange
    const dto = {
      id: '1',
      from: '1',
      to: '2',
      content: 'hello world',
      signature: 'xyz',
      type: '1',
    };
    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('type');
    expect(errors[0].constraints?.isNumber).toContain(
      'type ' + SHOULD_BE_OF_TYPE_NUMBER,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      id: '1',
      from: '1',
      to: '2',
      content: 'hello world',
      signature: 'xyz',
      type: 1,
    };

    const createBpiMessageDto = plainToInstance(CreateBpiMessageDto, dto);

    // Act
    const errors = await validate(createBpiMessageDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
