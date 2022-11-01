import { IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class UpdateWorkgroupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  administratorIds: string[];

  @IsNotEmpty()
  @ArrayNotEmpty()
  participantIds: string[];

  @IsNotEmpty()
  securityPolicy: string;

  @IsNotEmpty()
  privacyPolicy: string;
}
