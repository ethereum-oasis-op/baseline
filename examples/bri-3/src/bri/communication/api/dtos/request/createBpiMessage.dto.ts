import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBpiMessageDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}
