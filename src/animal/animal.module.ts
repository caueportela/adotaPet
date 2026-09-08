import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service.js';
import { AnimalController } from './animal.controller.js';
import { Animal } from './entities/animal.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([Animal]), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
