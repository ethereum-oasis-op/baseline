import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AnchorHash } from '../models/anchorHash';
import { State } from '../models/state';
import { ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';

@Injectable()
export class AnchorHashStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getStateByAnchorHash(hash: string): Promise<State> {
    const anchorHashModel = await this.anchorHash.findUnique({
      where: { hash },
      include: {
        ownerBpiSubject: {
          include: {
            ownedAnchorHash: true,
          },
        },
        state: {
          include: {
            contentAddressableHash: true,
          },
        },
      },
    });

    if (!anchorHashModel) {
      throw new NotFoundException(ANCHOR_HASH_NOT_FOUND_ERR_MESSAGE);
    }

    const stateModel = anchorHashModel.state;
    return this.mapper.map(stateModel, State, State);
  }

  async createNewAnchorHash(anchorHash: AnchorHash): Promise<AnchorHash> {
    const newAnchorHashModel = await this.anchorHash.create({
      data: {
        id: anchorHash.id,
        ownerBpiSubjectId: anchorHash.ownerBpiSubjectId,
        hash: anchorHash.hash,
        stateId: anchorHash.stateId,
      },
      include: {
        ownerBpiSubject: {
          include: {
            ownedAnchorHash: true,
          },
        },
        state: {
          include: {
            contentAddressableHash: true,
          },
        },
      },
    });

    return this.mapper.map(newAnchorHashModel, AnchorHash, AnchorHash);
  }

  async createNewState(text: string): Promise<State> {
    const newStateModel = await this.state.create({
      data: {
        text: text,
      },
    });

    return this.mapper.map(newStateModel, State, State);
  }

  async deleteAnchorHash(AnchorHash: AnchorHash): Promise<void> {
    await this.anchorHash.delete({
      where: { id: AnchorHash.id },
    });
  }

  async deleteState(state: State): Promise<void> {
    await this.state.delete({
      where: { id: state.id },
    });
  }
}
