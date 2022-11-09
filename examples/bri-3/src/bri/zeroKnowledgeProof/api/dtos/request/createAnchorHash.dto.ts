import { IsNotEmpty } from 'class-validator';
import { BpiAccount } from '../../../../identity/bpiAccounts/models/bpiAccount';
import { DocumentObject } from '../../../models/document';

// TODO: Revisit validations rules once we move into business logic implementation
export class CreateAnchorHashDto {
  @IsNotEmpty()
  ownerAccountId: BpiAccount;

  @IsNotEmpty()
  document: DocumentObject;

  @IsNotEmpty()
  signature: string;
}
