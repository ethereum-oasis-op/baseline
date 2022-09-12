import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service';
import { BpiSubject } from '../models/bpiSubject';

@Injectable()
export class BpiSubjectRepository extends PrismaService {
    async getBpiSubjectById(id: string): Promise<BpiSubject> {
        const bpiSubjectModel = await this.bpiSubject.findUnique({ where: { id: id } });
        return new BpiSubject( // TODO: Write generic mapper prismaModel -> domainObject
            bpiSubjectModel.id, 
            bpiSubjectModel.name, 
            bpiSubjectModel.description, 
            bpiSubjectModel.type, 
            bpiSubjectModel.publicKey);
    }

    async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
        const newBpiSubjectModel = await this.bpiSubject.create({ // TODO: Write generic mapper domainObject -> prismaModel 
            data: {
                name: bpiSubject.name,
                description: bpiSubject.description,
                publicKey: bpiSubject.publicKey,
                type: bpiSubject.type
            }
        });

        return new BpiSubject(
            newBpiSubjectModel.id, 
            newBpiSubjectModel.name, 
            newBpiSubjectModel.description, 
            newBpiSubjectModel.type, 
            newBpiSubjectModel.publicKey);
    }
}