export class WorkstepExecutionFailuresEvent {
  constructor(public readonly id: string, public readonly err: string) {}
}
