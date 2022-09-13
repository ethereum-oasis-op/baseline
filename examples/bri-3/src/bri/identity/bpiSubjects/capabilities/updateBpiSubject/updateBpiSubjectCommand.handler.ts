import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BpiSubjectAgent } from "../../agents/bpiSubjects.agent";
import { UpdateBpiSubjectCommand } from "./updateBpiSubject.command";

@CommandHandler(UpdateBpiSubjectCommand)
export class UpdateBpiSubjectCommandHandler implements ICommandHandler<UpdateBpiSubjectCommand> {
  constructor(private agent: BpiSubjectAgent) {}

  async execute(command: UpdateBpiSubjectCommand) {
    const { id, name, desc, publicKey } = command;

    // this.agent.throwIfUpdateBpiSubjectInvalid(name, desc, publicKey);

    // const bpiSubjectToUpdate = this.agent.fetchBpiSubjectToUpdate(id);
    // this.agent.updateBpiSubject(bpiSubjectToUpdate, name, desc, publicKey);

    // TODO: Generic map of domain model to entity model
    // this.orm.store(newBpiSubject);

    // TODO: Response DTO
    return true;
  }
}