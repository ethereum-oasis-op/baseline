import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BpiSubjectAgent } from "../../agents/bpiSubjects.agent";
import { CreateBpiSubjectCommand } from "./createBpiSubject.command";

@CommandHandler(CreateBpiSubjectCommand)
export class CreateBpiSubjectCommandHandler implements ICommandHandler<CreateBpiSubjectCommand> {
  
  constructor(private agent: BpiSubjectAgent) {}

  async execute(command: CreateBpiSubjectCommand) {
    this.agent.throwIfCreateBpiSubjectInputInvalid(command._name, command._description, command._publicKey);
    const newBpiSubject = this.agent.createNewExternalBpiSubject(command._name, command._description, command._publicKey);
    
    // TODO: Generic map of domain model to entity model
    // this.orm.store(newBpiSubject);

    // TODO: Response DTO
    return true;
  }
}
