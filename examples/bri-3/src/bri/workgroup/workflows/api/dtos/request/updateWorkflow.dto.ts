import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class UpdateWorkflowDto {
  @IsNotEmpty()
  name: string;

  @ArrayNotEmpty()
  workstepIds: string[];

  @IsNotEmpty()
  workgroupId: string;
}
