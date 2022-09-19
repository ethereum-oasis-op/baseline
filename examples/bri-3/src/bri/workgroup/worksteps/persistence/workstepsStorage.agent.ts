import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workstep } from '../models/workstep';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkstepStorageAgent extends PrismaService {
  async getWorkstepById(id: string): Promise<Workstep> {
    const workstepModel = await this.workstep.findUnique({ where: { id: id } });

    if (!workstepModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new Workstep( // TODO: Write generic mapper prismaModel -> domainObject
      workstepModel.id,
      workstepModel.name,
      workstepModel.version,
      workstepModel.status,
      workstepModel.workgroupId,
      workstepModel.securityPolicy,
      workstepModel.privacyPolicy
    );
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    const workstepModels = await this.workstep.findMany();
    return workstepModels.map(w => {
        return new Workstep( 
            w.id, 
            w.name, 
            w.version, 
            w.status, 
            w.workgroupId,
            w.securityPolicy,
            w.privacyPolicy)
    })  
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const newWorkstepModel = await this.workstep.create({ // TODO: Write generic mapper domainObject -> prismaModel
      data: {
        id: workstep.id,
        name: workstep.name,
        version: workstep.version,
        status: workstep.status,
        workgroupId: workstep.workgroupId,
        securityPolicy: workstep.securityPolicy,
        privacyPolicy: workstep.privacyPolicy,
      },
    });

    return new Workstep(
      newWorkstepModel.id,
      newWorkstepModel.name,
      newWorkstepModel.version,
      newWorkstepModel.status,
      newWorkstepModel.workgroupId,
      newWorkstepModel.securityPolicy,
      newWorkstepModel.privacyPolicy);
  }

  async updateWorkstep(workstep: Workstep): Promise<Workstep> {
    const newWorkstepModel = await this.workstep.update({
        where: { id: workstep.id },
        data: {
            name: workstep.name,
            version: workstep.version,
            status: workstep.status,
            workgroupId: workstep.workgroupId,
            securityPolicy: workstep.securityPolicy,
            privacyPolicy: workstep.privacyPolicy
        }
    });

    return new Workstep(
        newWorkstepModel.id, 
        newWorkstepModel.name, 
        newWorkstepModel.version, 
        newWorkstepModel.status, 
        newWorkstepModel.workgroupId,
        newWorkstepModel.securityPolicy,
        newWorkstepModel.privacyPolicy);
  }

  async deleteWorkstep(workstep: Workstep): Promise<void> {
    await this.workstep.delete({
        where: { id: workstep.id },
    });
  }
}
