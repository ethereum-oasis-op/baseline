import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const internalBpiSubjectRole = await prisma.bpiSubjectRole.upsert({
    where: { name: 'INTERNAL_BPI_SUBJECT' },
    update: {},
    create: {
      name: 'INTERNAL_BPI_SUBJECT',
      description: 'Internal Bpi Subject',
    },
  });

  await prisma.bpiSubjectRole.upsert({
    where: { name: 'EXTERNAL_BPI_SUBJECT' },
    update: {},
    create: {
      name: 'EXTERNAL_BPI_SUBJECT',
      description: 'External Bpi Subject',
    },
  });

  await prisma.bpiSubject.create({
    data: {
        name: 'BpiAdmin',
        description: 'Internal Bpi Subject of this Bpi',
        publicKey: '0x08872e27BC5d78F1FC4590803369492868A1FCCb', // private key 2c95d82bcd8851bd3a813c50afafb025228bf8d237e8fd37ba4adba3a7596d58, used for testing purposes only
        loginNonce: '',
        roles: {
          connect: {
            id: internalBpiSubjectRole.id
          },
        },
    }      
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
