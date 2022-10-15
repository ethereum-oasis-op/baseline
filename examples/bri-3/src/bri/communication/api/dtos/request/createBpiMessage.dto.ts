import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBpiMessageDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  fromId: string;

  @IsNotEmpty()
  toId: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  signature: string;

  @IsNotEmpty()
  @IsNumber()
  type: number;
}
