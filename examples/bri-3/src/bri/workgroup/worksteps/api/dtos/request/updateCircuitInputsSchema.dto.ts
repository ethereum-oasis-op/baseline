import { IsNotEmpty } from 'class-validator';

export class UpdateCircuitInputsSchemaDto {
  @IsNotEmpty()
  schema: string;
}
