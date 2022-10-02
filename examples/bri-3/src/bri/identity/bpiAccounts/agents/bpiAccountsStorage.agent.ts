import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiAccountStorageAgent extends PrismaService {
  async getAccountById(id: string): Promise<BpiAccount> {
    const bpiAccountModel = await this.bpiAccount.findUnique({
      where: { id },
    });

    if (!bpiAccountModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return new BpiAccount(bpiAccountModel.id, bpiAccountModel.nonce, []);
  }

  async getAllBpiAccounts(): Promise<BpiAccount[]> {
    const bpiAccountModels = await this.bpiAccount.findMany();
    return bpiAccountModels.map((bp) => {
      return new BpiAccount(bp.id, bp.nonce, []);
    });
  }

  async createNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const newBpiAccountModel = await this.bpiAccount.create({
      data: {
        nonce: bpiAccount.nonce,
      },
    });

    return new BpiAccount(newBpiAccountModel.id, newBpiAccountModel.nonce, []);
  }

  async updateBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const newBpiAccountModel = await this.bpiAccount.update({
      where: { id: bpiAccount.id },
      data: {
        nonce: bpiAccount.nonce,
      },
    });

    return new BpiAccount(newBpiAccountModel.id, newBpiAccountModel.nonce, []);
  }

  async deleteBpiAccount(bpiAccount: BpiAccount): Promise<void> {
    await this.bpiAccount.delete({
      where: { id: bpiAccount.id },
    });
  }
}
