import { IsNotEmpty } from 'class-validator';
import { DocumentObject } from '../../../models/document';

export class VerifyAnchorHashDto {
  @IsNotEmpty()
  document: DocumentObject;

  @IsNotEmpty()
  signature: string;
}
