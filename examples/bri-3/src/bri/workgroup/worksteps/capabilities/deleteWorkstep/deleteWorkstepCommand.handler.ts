import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WorkstepAgent } from "../../agents/worksteps.agent";
import { DeleteWorkstepCommand } from "./deleteWorkstep.command";

@CommandHandler(DeleteWorkstepCommand)
export class DeleteWorkstepCommandHandler implements ICommandHandler<DeleteWorkstepCommand> {
  constructor(private agent: WorkstepAgent, private storageAgent: WorkstepStorageAgent) {}

  async execute(command: DeleteWorkstepCommand) {
    const workstepToDelete = await this.agent.fetchDeleteCandidateAndThrowIfDeleteValidationFails(command.id);
    await this.storageAgent.deleteworkstep(workstepToDelete);
    
    return;
  }
}