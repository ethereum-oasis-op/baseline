import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BpiSubjectAgent } from "../../agents/bpiSubjects.agent";
import { CreateBpiSubjectCommand } from "./createBpiSubject.command";

@CommandHandler(CreateBpiSubjectCommand)
export class CreateBpiSubjectCommandHandler implements ICommandHandler<CreateBpiSubjectCommand> {
  
  constructor(private agent: BpiSubjectAgent) {}

  async execute(command: CreateBpiSubjectCommand) {
    this.agent.throwIfCreateBpiSubjectInputInvalid(command.name, command.description, command.publicKey);
    const newBpiSubject = this.agent.createNewExternalBpiSubject(command.name, command.description, command.publicKey);
    
    // TODO: Generic map of domain model to entity model
    // this.orm.store(newBpiSubject);

    // TODO: Response DTO
    return true;
  }
}
