import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class UpdateWorkflowDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  workstepIds: string[];

  @IsNotEmpty()
  workgroupId: string;
}
