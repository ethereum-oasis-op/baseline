import { IsNotEmpty } from 'class-validator';

export class GetCCSMAnchorHashDocumentDto {
  @IsNotEmpty()
  contentAddressableHash: string;
}
