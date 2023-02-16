import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AnchorHash } from '../models/anchorHash';

@Injectable()
export class AnchorHashStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async storeNewAnchorHash(anchorHash: AnchorHash): Promise<AnchorHash> {
    const newAnchorHashModel = await this.anchorHash.create({
      data: {
        id: anchorHash.id,
        ownerBpiSubjectId: anchorHash.ownerBpiSubjectId,
        hash: anchorHash.hash,
        signature: anchorHash.signature,
      },
      include: {
        ownerBpiSubject: {
          include: {
            ownedAnchorHashes: true,
          },
        },
      },
    });

    return this.mapper.map(newAnchorHashModel, AnchorHash, AnchorHash);
  }

  async deleteAnchorHash(AnchorHash: AnchorHash): Promise<void> {
    await this.anchorHash.delete({
      where: { id: AnchorHash.id },
    });
  }
}
