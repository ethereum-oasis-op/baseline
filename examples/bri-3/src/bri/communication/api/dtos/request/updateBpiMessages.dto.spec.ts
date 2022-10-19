import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { UpdateBpiMessageDto } from './updateBpiMessage.dto';

describe('UpdateBpiMessageDto', () => {
  it('should return error in case content not provided.', async () => {
    // Arrange
    const dto = { signature: '2323' };
    const updateBpiMessageDto = plainToInstance(UpdateBpiMessageDto, dto);

    // Act
    const errors = await validate(updateBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('content');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'content ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return error in case signature not provided.', async () => {
    // Arrange
    const dto = { content: 'this is content' };
    const updateBpiMessageDto = plainToInstance(UpdateBpiMessageDto, dto);

    // Act
    const errors = await validate(updateBpiMessageDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('signature');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'signature ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = { content: 'this is content', signature: '2323' };

    const updateBpiMessageDto = plainToInstance(UpdateBpiMessageDto, dto);

    // Act
    const errors = await validate(updateBpiMessageDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
