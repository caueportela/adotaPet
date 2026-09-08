import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Interesse } from './entities/interesse.entity.js';
import { Animal } from '../animal/entities/animal.entity.js';
import { InteresseService } from './interesse.service.js';
import { InteresseController } from './interesse.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interesse, Animal]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [InteresseController],
  providers: [InteresseService],
})
export class InteresseModule {}
