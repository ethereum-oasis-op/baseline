import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBpiSubjectCommand } from "../commands/createBpiSubject.command";

@CommandHandler(CreateBpiSubjectCommand)
export class CreateBpiSubjectCommandHandler implements ICommandHandler<CreateBpiSubjectCommand> {
  constructor() {}

  async execute(command: CreateBpiSubjectCommand) {
    const { prop1, prop2 } = command;
    // 1. validate props for new bpi subject cretation
    // 2. create the bpi subject
    // 3. store the bpi subject
    // 4. throw events to trigger any relevant business logic (i.e. inform bpi owner)
    return true;
  }
}