import { uuid } from 'uuidv4';

export class DeleteWorkflowCommand {
  constructor(private id: typeof uuid) {}
  public get _id(): typeof uuid {
    return this.id;
  }
}
