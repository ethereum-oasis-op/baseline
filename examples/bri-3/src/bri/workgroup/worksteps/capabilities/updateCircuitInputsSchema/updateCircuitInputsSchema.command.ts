export class UpdateCircuitInputsSchemaCommand {
  constructor(
    public readonly workstepId: string,
    public readonly schema: string,
  ) {}
}
