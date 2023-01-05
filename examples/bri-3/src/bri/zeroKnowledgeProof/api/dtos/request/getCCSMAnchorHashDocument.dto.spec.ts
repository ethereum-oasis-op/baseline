import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE } from '../../../../shared/constants';
import { GetCCSMAnchorHashDocumentDto } from './getCCSMAnchorHashDocument.dto';

describe('GetCCSMAnchorHashDocumentDto', () => {
  it('should return error in case content addressable hash is not provided.', async () => {
    // Arrange
    const dto = {};
    const getCCSMAnchorHashDocumentDto = plainToInstance(
      GetCCSMAnchorHashDocumentDto,
      dto,
    );

    // Act
    const errors = await validate(getCCSMAnchorHashDocumentDto);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toEqual('contentAddressableHash');
    expect(errors[0].constraints.isNotEmpty).toContain(
      'contentAddressableHash ' + SHOULD_NOT_BE_EMPTY_VALIDATION_MESSAGE,
    );
  });

  it('should return no error if all required properties provided.', async () => {
    // Arrange
    const dto = {
      contentAddressableHash:
        'YTk3OGQxZmQ2NzA0Njg0MTIyMmIzODI0OTcxODVjZmM3MTg2NmY0Njk2ZTA1OWFjZTFmMjg0ZjFiNzA1N2Q2ZA==',
    };
    const getCCSMAnchorHashDocumentDto = plainToInstance(
      GetCCSMAnchorHashDocumentDto,
      dto,
    );

    // Act
    const errors = await validate(getCCSMAnchorHashDocumentDto);

    // Assert
    expect(errors.length).toBe(0);
  });
});
