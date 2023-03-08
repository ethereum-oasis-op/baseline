import { EncryptionService } from './encryption.service';

let encryptionService: EncryptionService;

beforeAll(async () => {
  encryptionService = new EncryptionService();
});

describe('Encryption Service', () => {
  it('Should encrypt and decrypt properly', async () => {
    // Arrange
    const testContent = 'Liftbois are real';

    // Act
    var encryptedContent = await encryptionService.encrypt(testContent);
    var decrytedContent = await encryptionService.decrypt(encryptedContent);

    // Assert
    expect(decrytedContent).toEqual(testContent);
  });
});
