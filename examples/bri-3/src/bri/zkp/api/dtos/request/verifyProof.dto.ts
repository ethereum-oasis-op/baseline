import { IsNotEmpty } from 'class-validator';
import DocumentObject from '../../../types/document';

export class VerifyProofDto {
  @IsNotEmpty()
  document: DocumentObject;

  @IsNotEmpty()
  signature: string;
}
