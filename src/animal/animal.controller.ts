import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnimalService } from './animal.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { Role } from '../user/entities/user.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { FindAnimalDto } from './dto/find-animal.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';
import { UpdateAnimalStatusDto } from './dto/update-status-animal.dto.js';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FUNCIONARIO)
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }

  @Get()
  findAll(@Query() query: FindAnimalDto) {
    return this.animalService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FUNCIONARIO)
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.update(id, updateAnimalDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FUNCIONARIO)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAnimalStatusDto) {
    return this.animalService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FUNCIONARIO)
  remove(@Param('id') id: string) {
    return this.animalService.remove(id);
  }
}
