// ts-node ./prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.users.upsert({
    where: { email: 'difaadmin@gmail.com' },
    update: {},
    create: {
      email: 'difaadmin@gmail.com',
      name: 'Difa Admin',
      role: 'admin',
      verification: 'verified',
      created_at: new Date(),
      password: await bcrypt.hash('difaadmin123', 10),
    },
  });

  console.log({ admin });
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
