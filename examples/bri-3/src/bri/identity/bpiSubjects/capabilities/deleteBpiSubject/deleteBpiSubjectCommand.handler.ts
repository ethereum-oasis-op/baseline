import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BpiSubjectAgent } from "../../agents/bpiSubjects.agent";
import { BpiSubjectRepository } from "../../persistence/bpiSubjects.repository";
import { DeleteBpiSubjectCommand } from "./deleteBpiSubject.command";

@CommandHandler(DeleteBpiSubjectCommand)
export class DeleteBpiSubjectCommandHandler implements ICommandHandler<DeleteBpiSubjectCommand> {
  constructor(private agent: BpiSubjectAgent, private repo: BpiSubjectRepository) {}

  async execute(command: DeleteBpiSubjectCommand) {
    const bpiSubjectToDelete = await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(command.id);
    await this.repo.deleteBpiSubject(bpiSubjectToDelete);
    
    return;
  }
}