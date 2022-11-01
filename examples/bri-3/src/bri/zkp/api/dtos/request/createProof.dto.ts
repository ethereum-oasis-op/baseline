import { IsNotEmpty } from 'class-validator';
import DocumentObject from '../../../types/document';

// TODO: Revisit validations rules once we move into business logic implementation
export class CreateProofDto {
  @IsNotEmpty()
  ownerAccountId: string;

  @IsNotEmpty()
  document: DocumentObject;

  @IsNotEmpty()
  signature: string;
}
