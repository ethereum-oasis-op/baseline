import { IsNotEmpty } from 'class-validator';

export class CreateMerkleTreeDto {
  @IsNotEmpty()
  leaves: string[];

  @IsNotEmpty()
  hashFunction: string;
}
