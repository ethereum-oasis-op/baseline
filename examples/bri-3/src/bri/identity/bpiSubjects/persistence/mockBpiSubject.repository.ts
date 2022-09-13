import { Injectable } from '@nestjs/common'
import { uuid } from 'uuidv4';
import { BpiSubject } from '../models/bpiSubject';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class MockBpiSubjectRepository {
    private bpiSubjectsStore: BpiSubject[] = [];

    async getBpiSubjectById(id: string): Promise<BpiSubject> {
        return this.bpiSubjectsStore.find(bp => bp.id === id);
    }

    async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
        const createdBp = new BpiSubject(
            uuid(),
            bpiSubject.name, 
            bpiSubject.description, 
            bpiSubject.type, 
            bpiSubject.publicKey);
        
            this.bpiSubjectsStore.push(createdBp);

            return Promise.resolve(createdBp);
    }
}