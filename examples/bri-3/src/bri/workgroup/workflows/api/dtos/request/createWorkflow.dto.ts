import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class CreateWorkflowDto {
  @IsNotEmpty()
  name: string;

  @ArrayNotEmpty()
  workstepIds: string[];

  @IsNotEmpty()
  workgroupId: string;
}
