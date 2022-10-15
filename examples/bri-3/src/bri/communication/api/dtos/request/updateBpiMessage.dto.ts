import { IsNotEmpty } from 'class-validator';

export class UpdateBpiMessageDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  signature: string;
}
