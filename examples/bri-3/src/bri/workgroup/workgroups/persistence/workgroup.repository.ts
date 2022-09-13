import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Workgroup } from '../models/workgroup';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class WorkgroupRepository extends PrismaService {
  async getWorkgroupById(id: string): Promise<Workgroup> {
    const workgroupModel = await this.workgroup.findUnique({ where: { id: id } });
    return new Workgroup( // TODO: Write generic mapper prismaModel -> domainObject
      workgroupModel.id,
      workgroupModel.name,
      workgroupModel.administrator,
      workgroupModel.securityPolicy,
      workgroupModel.privacyPolicy,
      workgroupModel.participants,
      workgroupModel.worksteps,
      workgroupModel.workflows
    );
  }

  async createNewWorkgroup(workgroup: Workgroup): Promise<Workgroup> {
    const newWorkgroupModel = await this.workgroup.create({
      // TODO: Write generic mapper domainObject -> prismaModel
      data: {
        name: workgroup.name,
        administrator: workgroup.administrator,
        securityPolicy: workgroup.securityPolicy,
        privacyPolicy: workgroup.privacyPolicy,
        participants: workgroup.participants,
        worksteps: workgroup.worksteps,
        workflows: workgroup.workflows
      },
    });

    return new Workgroup(
      newWorkgroupModel.id,
      newWorkgroupModel.name,
      newWorkgroupModel.administrator,
      newWorkgroupModel.securityPolicy,
      newWorkgroupModel.privacyPolicy,
      newWorkgroupModel.participants,
      newWorkgroupModel.worksteps,
      newWorkgroupModel.workflows,
    );
  }
}
