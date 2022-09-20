import { IsNotEmpty } from "class-validator";

export class UpdateWorkstepDto {
  @IsNotEmpty()
  name: string;

  version: string;

  status: string;

  @IsNotEmpty()
  workgroupId: string;

  securityPolicy: string;

  privacyPolicy: string;
}
