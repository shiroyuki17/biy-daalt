const prisma = require('./backend/src/config/db');
const bcrypt = require('bcryptjs');

async function main() {
  const email = 'admin@gaming.com';
  const username = 'admin';
  const password = 'password123';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword
    },
    create: {
      email,
      username,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created/updated:');
  console.log('Email:', email);
  console.log('Password:', password);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
