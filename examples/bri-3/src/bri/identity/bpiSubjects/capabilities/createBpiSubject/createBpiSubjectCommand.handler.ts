import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BpiSubjectAgent } from "../../agents/bpiSubjects.agent";
import { BpiSubjectRepository } from "../../persistence/bpiSubjects.repository";
import { CreateBpiSubjectCommand } from "./createBpiSubject.command";

@CommandHandler(CreateBpiSubjectCommand)
export class CreateBpiSubjectCommandHandler implements ICommandHandler<CreateBpiSubjectCommand> {
  
  constructor(private agent: BpiSubjectAgent, private repo: BpiSubjectRepository) {}

  async execute(command: CreateBpiSubjectCommand) {
    this.agent.throwIfCreateBpiSubjectInputInvalid(command.name, command.description, command.publicKey);
  
    const newBpiSubjectCandidate = this.agent.createNewExternalBpiSubject(command.name, command.description, command.publicKey);
  
    const newBpiSubject = await this.repo.createNewBpiSubject(newBpiSubjectCandidate);
    
    return newBpiSubject.id;
  }
}
