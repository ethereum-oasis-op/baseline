import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { WorkstepDto } from "../../api/dtos/response/workstep.dto";
import { GetAllWorkstepsQuery } from "./getAllWorksteps.query";

@QueryHandler(GetAllWorkstepsQuery)
export class GetAllWorkstepsQueryHandler implements IQueryHandler<GetAllWorkstepsQuery> {
  constructor(
    private readonly storageAgent: WorkstepStorageAgent,
  ) {}

  async execute(query: GetAllWorkstepsQuery) {
    const worksteps = await this.storageAgent.getAllWorksteps();

    return worksteps.map(w => {
      return  {
        id: w.id,
        name: w.name,
        version: w.version,
        status: w.status,
        workgroupId: w.workgroupId,
        securityPolicy: w.securityPolicy,
        privacyPolicy: w.privacyPolicy
      } as WorkstepDto
    })
  }
}