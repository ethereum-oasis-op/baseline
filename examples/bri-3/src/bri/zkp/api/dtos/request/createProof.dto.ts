import { IsNotEmpty } from 'class-validator';

// TODO: Revisit validations rules once we move into business logic implementation
export class CreateProofDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  owner: number;

  @IsNotEmpty()
  ownerAccountId: string;

  @IsNotEmpty()
  document: any;

  @IsNotEmpty()
  signature: string;
}
