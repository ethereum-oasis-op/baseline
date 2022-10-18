import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateWorkgroupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  administratorIds: string[];

  @IsNotEmpty()
  @ArrayNotEmpty()
  parcitipantIds: string[];

  @IsNotEmpty()
  securityPolicy: string;

  @IsNotEmpty()
  privacyPolicy: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  workstepIds: string[];

  @IsNotEmpty()
  @ArrayNotEmpty()
  workflowIds: string[];
}
