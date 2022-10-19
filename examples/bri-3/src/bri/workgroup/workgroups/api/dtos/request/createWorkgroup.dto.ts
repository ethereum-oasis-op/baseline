import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateWorkgroupDto {
  @IsNotEmpty()
  name: string;

  administratorIds: string[];

  parcitipantIds: string[];

  @IsNotEmpty()
  securityPolicy: string;

  @IsNotEmpty()
  privacyPolicy: string;

  workstepIds: string[];

  workflowIds: string[];
}
