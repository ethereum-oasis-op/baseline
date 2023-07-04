import { IsNotEmpty } from 'class-validator';

export class CreateMerkleTreeDto {
  @IsNotEmpty()
  leaves: string[];

  @IsNotEmpty()
  hashAlgName: string;
}
