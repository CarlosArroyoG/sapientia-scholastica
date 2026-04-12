// Script de semilla: crea el usuario admin inicial
// Uso: npm run db:seed
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@sapientia.edu';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'sapientia2026';
  const name = 'Administrador';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ya existe: ${email}`);
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hash, name, role: Role.ADMIN },
  });
  console.log(`Admin creado: ${user.email} (ID: ${user.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
