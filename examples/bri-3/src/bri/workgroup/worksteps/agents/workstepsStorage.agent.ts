import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workstep } from '../models/workstep';
import { getType } from "tst-reflect";
import Mapper from '../../../utils/mapper';

// Storage Agents are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkstepStorageAgent extends PrismaService {

  async getWorkstepById(id: string): Promise<Workstep> {
    const workstepModel = await this.workstep.findUnique({ where: { id } });

    if (!workstepModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return Mapper.map(workstepModel, getType<Workstep>()) as Workstep;
  }

  async getAllWorksteps(): Promise<Workstep[]> {
    const workstepModels = await this.workstep.findMany();
    return workstepModels.map((workstepModel) => {
      return Mapper.map(workstepModel, getType<Workstep>()) as Workstep
    });
  }

  async createNewWorkstep(workstep: Workstep): Promise<Workstep> {
    const {id, name, version, status, workgroupId, securityPolicy, privacyPolicy} = workstep
    const newWorkstepModel = await this.workstep.create({
      data: {id, name, version, status, workgroupId, securityPolicy, privacyPolicy},
    });

    return Mapper.map(newWorkstepModel, getType<Workstep>()) as Workstep
  }

  async updateWorkstep(workstep: Workstep): Promise<Workstep> {
    const {id, name, version, status, workgroupId, securityPolicy, privacyPolicy} = workstep
    const updatedWorkstepModel = await this.workstep.update({
      where: { id },
      data: { name, version, status, workgroupId, securityPolicy, privacyPolicy},
    });

    return Mapper.map(updatedWorkstepModel, getType<Workstep>()) as Workstep
  }

  async deleteWorkstep(workstep: Workstep): Promise<void> {
    await this.workstep.delete({
      where: { id: workstep.id },
    });
  }
}
