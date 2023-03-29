import { IsNotEmpty } from 'class-validator';

export class UpdateMerkleTreeDto {
  @IsNotEmpty()
  leaves: string[];

  @IsNotEmpty()
  hashFunction: string;
}
