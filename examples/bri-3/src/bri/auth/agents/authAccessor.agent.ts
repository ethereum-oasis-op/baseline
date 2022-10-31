import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthAccesorService extends PrismaService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<any> {
    // const bpiSubjectModel = await this.bpiSubject.findUnique({
    //   where: { id },
    // });

    // if (!bpiSubjectModel) {
    //   throw new NotFoundException('not found');
    // }
    // return bpiSubjectModel;
    return this.users.find((user) => user.username === username);
  }
}
