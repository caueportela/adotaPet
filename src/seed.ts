import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UserService } from './user/user.service.js';
import { Role } from './user/entities/user.entity.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const email = process.env.SEED_ADMIN_EMAIL;
  const senha = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !senha) {
    console.error('Defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD no .env antes de rodar o seed.');
    await app.close();
    process.exit(1);
  }

  const existente = await userService.findByEmail(email);
  if (existente) {
    console.log(`Admin "${email}" já existe, nada a fazer.`);
  } else {
    await userService.create({
      nome: 'Admin',
      email,
      senha,
      role: Role.ADMIN,
    });
    console.log(`Admin criado: ${email} / ${senha}`);
  }

  await app.close();
}

seed();
