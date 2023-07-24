import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateWorkflowDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  workstepIds: string[];

  @IsNotEmpty()
  workgroupId: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  workflowBpiAccountSubjectAccountOwnersIds: string[];
}
