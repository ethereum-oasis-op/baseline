import { IsNotEmpty } from 'class-validator';

export class CreateWorkgroupDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  securityPolicy: string;

  @IsNotEmpty()
  privacyPolicy: string;

  workstepIds: string[];

  workflowIds: string[];
}
