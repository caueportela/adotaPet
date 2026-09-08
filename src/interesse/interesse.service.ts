import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interesse } from './entities/interesse.entity.js';
import { Animal } from '../animal/entities/animal.entity.js';
import { User } from '../user/entities/user.entity.js';
import { CreateInteresseDto } from './dto/create-interesse.dto.js';
import { UpdateStatusInteresseDto } from './dto/update-status-interesse.dto.js';

@Injectable()
export class InteresseService {
  constructor(
    @InjectRepository(Interesse)
    private readonly interesseRepository: Repository<Interesse>,
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
  ) {}

  async create(createInteresseDto: CreateInteresseDto): Promise<Interesse> {
    const { animalId, ...dados } = createInteresseDto;

    const animal = await this.animalRepository.findOne({ where: { id: animalId } });
    if (!animal) {
      throw new NotFoundException('Animal não encontrado.');
    }

    const novoInteresse = this.interesseRepository.create({ ...dados, animal });
    return this.interesseRepository.save(novoInteresse);
  }

  findAll(): Promise<Interesse[]> {
    return this.interesseRepository.find({ relations: { animal: true, analisadoPor: true } });
  }

  async updateStatus(
    id: string,
    updateStatusInteresseDto: UpdateStatusInteresseDto,
    analisadoPorId: string,
  ): Promise<Interesse> {
    const interesse = await this.interesseRepository.findOne({ where: { id } });
    if (!interesse) {
      throw new NotFoundException('Manifestação de interesse não encontrada.');
    }

    interesse.status = updateStatusInteresseDto.status;
    interesse.analisadoPor = { id: analisadoPorId } as User;

    return this.interesseRepository.save(interesse);
  }
}
