import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.bpiSubjectRole.upsert({
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
