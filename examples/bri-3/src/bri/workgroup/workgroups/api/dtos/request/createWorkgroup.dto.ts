import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateWorkgroupDto {
  @IsNotEmpty()
  name: string;

  @ArrayNotEmpty()
  administratorIds: string[];

  @ArrayNotEmpty()
  participantIds: string[];

  @IsNotEmpty()
  securityPolicy: string;

  @IsNotEmpty()
  privacyPolicy: string;

  workstepIds: string[];

  workflowIds: string[];
}
