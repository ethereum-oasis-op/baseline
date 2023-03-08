import { EncryptionService } from './encryption.service';

let encryptionService: EncryptionService;

beforeAll(async () => {
  process.env.BPI_ENCRYPTION_KEY_K_PARAM =
    'yzkXp3vY_AZQ3YfLv9GMRTYkjUOpn9x18gPkoFvoUxQ';
  process.env.BPI_ENCRYPTION_KEY_KTY_PARAM = 'oct';
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
