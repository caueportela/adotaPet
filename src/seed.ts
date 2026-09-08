import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UserService } from './user/user.service.js';
import { Role } from './user/entities/user.entity.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@adotapet.com';
  const senha = process.env.SEED_ADMIN_PASSWORD ?? 'admin123';

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
