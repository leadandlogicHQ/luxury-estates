import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@luxuryestates.com';
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: 'ADMIN' }, // This fixes broken passwords
    create: { email, password: hashed, role: 'ADMIN' },
  });

  console.log('✅ Admin ready →', user.email, '| role:', user.role);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());