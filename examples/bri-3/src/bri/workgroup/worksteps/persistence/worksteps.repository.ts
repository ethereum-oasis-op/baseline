import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workstep } from '../models/workstep';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkstepRepository extends PrismaService {
  async getWorkstepById(id: string): Promise<Workstep> {
    const workstepModel = await this.workstep.findUnique({ where: { id: id } });
    return new Workstep( // TODO: Write generic mapper prismaModel -> domainObject
      workstepModel.id,
      workstepModel.name,
      workstepModel.version,
      workstepModel.status,
      workstepModel.workgroupId,
      workstepModel.securityPolicy,
      workstepModel.privacyPolicy,
    );
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const newWorkstepModel = await this.workstep.create({
      // TODO: Write generic mapper domainObject -> prismaModel
      data: {
        id: workstep.id,
        name: workstep.name,
        version: workstep.version,
        status: workstep.status,
        workgroupId: workstep.workgroupId,
        // securityPolicy: workstep.securityPolicy,
        // privacyPolicy: workstep.privacyPolicy,
      },
    });

    return new Workstep(
      newWorkstepModel.id,
      newWorkstepModel.name,
      newWorkstepModel.version,
      newWorkstepModel.status,
      newWorkstepModel.workgroupId,
      newWorkstepModel.securityPolicy,
      newWorkstepModel.privacyPolicy,
    );
  }
}
