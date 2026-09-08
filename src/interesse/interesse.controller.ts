import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { InteresseService } from './interesse.service.js';
import { CreateInteresseDto } from './dto/create-interesse.dto.js';
import { UpdateStatusInteresseDto } from './dto/update-status-interesse.dto.js';
import { Role } from '../user/entities/user.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';

@Controller('interesse')
export class InteresseController {
  constructor(private readonly interesseService: InteresseService) {}

  @Post()
  create(@Body() createInteresseDto: CreateInteresseDto) {
    return this.interesseService.create(createInteresseDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FUNCIONARIO)
  findAll() {
    return this.interesseService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FUNCIONARIO)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusInteresseDto: UpdateStatusInteresseDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.interesseService.updateStatus(id, updateStatusInteresseDto, req.user.sub);
  }
}
