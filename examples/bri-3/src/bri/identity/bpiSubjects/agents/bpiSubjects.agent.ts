import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { BpiSubject } from '../models/bpiSubject';
import {
  NAME_EMPTY_ERR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
} from '../api/err.messages';
import { BpiSubjectStorageAgent } from './bpiSubjectsStorage.agent';
import { BpiSubjectRoleName } from '../models/bpiSubjectRole';
import { PublicKeyDto } from '../api/dtos/request/publicKey.dto';
import { PublicKey, PublicKeyType } from '../models/publicKey';

// Agent methods have extremely declarative names and perform a single task
@Injectable()
export class BpiSubjectAgent {
  constructor(private storageAgent: BpiSubjectStorageAgent) {}
  public throwIfCreateBpiSubjectInputInvalid(name: string) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..)
    if (!name) {
      throw new BadRequestException(NAME_EMPTY_ERR_MESSAGE);
    }
  }

  public async createNewExternalBpiSubject(
    name: string,
    description: string,
    publicKeys: PublicKeyDto[],
  ): Promise<BpiSubject> {
    const externalRole = await this.storageAgent.getBpiSubjectRoleByName(
      BpiSubjectRoleName.EXTERNAL_BPI_SUBJECT,
    );

    const bpiSubjectId = v4();

    const publicKeyCandidates = publicKeys.map((key) => {
      let publicKeyType;

      switch (key.type.toLowerCase()) {
        case 'ecdsa':
          publicKeyType = PublicKeyType.ECDSA;
          break;
        case 'eddsa':
          publicKeyType = PublicKeyType.EDDSA;
          break;
        default:
      }
      return new PublicKey(v4(), publicKeyType, key.value, bpiSubjectId);
    });

    return new BpiSubject(
      bpiSubjectId,
      name,
      description,
      publicKeyCandidates,
      [externalRole],
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<BpiSubject> {
    const bpiSubjectToUpdate: BpiSubject | undefined =
      await this.storageAgent.getBpiSubjectById(id);

    if (!bpiSubjectToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectToUpdate;
  }

  public async fetchUpdateCandidatesAndThrowIfValidationFails(
    ids: string[],
  ): Promise<BpiSubject[]> {
    const bpiSubjects = await this.storageAgent.getBpiSubjectsById(ids);

    if (ids.length != bpiSubjects.length) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjects;
  }

  public updateBpiSubject(
    bpiSubjectToUpdate: BpiSubject,
    name: string,
    description: string,
  ) {
    bpiSubjectToUpdate.updateName(name);
    bpiSubjectToUpdate.updateDescription(description);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<BpiSubject> {
    const bpiSubjectToDelete = await this.storageAgent.getBpiSubjectById(id);

    if (!bpiSubjectToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectToDelete;
  }
}
