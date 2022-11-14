import { IsNotEmpty } from 'class-validator';
import { BpiSubjectAccount } from '../../../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { BpiAccount } from '../../../../identity/bpiAccounts/models/bpiAccount';
import { DocumentObject } from '../../../models/document';

// TODO: Revisit validations rules once we move into business logic implementation
export class CreateCCSMAnchorDto {
  @IsNotEmpty()
  ownerAccount: BpiSubjectAccount;

  @IsNotEmpty()
  agreementState: BpiAccount;

  @IsNotEmpty()
  document: DocumentObject;

  @IsNotEmpty()
  signature: string;
}
