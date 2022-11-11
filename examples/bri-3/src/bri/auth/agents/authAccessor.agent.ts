import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthAccesorService extends PrismaService {
  async findOne(publicKey: string): Promise<any> {
    console.log('publicKey', publicKey);
    const bpiSubjectModel = await this.bpiSubject.findFirstOrThrow({
      where: {
        publicKey: publicKey.toLowerCase(),
      },
    });
    console.log('bpiSubjectModel', bpiSubjectModel);
    return bpiSubjectModel;
  }
}
