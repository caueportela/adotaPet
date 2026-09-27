import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interesse, StatusInteresse } from './entities/interesse.entity.js';
import { Animal, StatusAnimal } from '../animal/entities/animal.entity.js';
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
    const interesseSalvo = await this.interesseRepository.save(novoInteresse);

    if (animal.status === StatusAnimal.DISPONIVEL) {
      animal.status = StatusAnimal.EM_PROCESSO;
      await this.animalRepository.save(animal);
    }

    return interesseSalvo;
  }

  findAll(): Promise<Interesse[]> {
    return this.interesseRepository.find({ relations: { animal: true, analisadoPor: true } });
  }

  async updateStatus(
    id: string,
    updateStatusInteresseDto: UpdateStatusInteresseDto,
    analisadoPorId: string,
  ): Promise<Interesse> {
    const interesse = await this.interesseRepository.findOne({
      where: { id },
      relations: { animal: true },
    });
    if (!interesse) {
      throw new NotFoundException('Manifestação de interesse não encontrada.');
    }

    interesse.status = updateStatusInteresseDto.status;
    interesse.analisadoPor = { id: analisadoPorId } as User;

    const interesseSalvo = await this.interesseRepository.save(interesse);

    if (updateStatusInteresseDto.status === StatusInteresse.APROVADO && interesse.animal) {
      interesse.animal.status = StatusAnimal.ADOTADO;
      await this.animalRepository.save(interesse.animal);
    }

    if (updateStatusInteresseDto.status === StatusInteresse.REJEITADO && interesse.animal) {
      const outrosInteressados = await this.interesseRepository.count({
        where: [
          { animal: { id: interesse.animal.id }, status: StatusInteresse.PENDENTE },
          { animal: { id: interesse.animal.id }, status: StatusInteresse.EM_ANALISE },
        ],
      });

      if (outrosInteressados === 0 && interesse.animal.status === StatusAnimal.EM_PROCESSO) {
        interesse.animal.status = StatusAnimal.DISPONIVEL;
        await this.animalRepository.save(interesse.animal);
      }
    }

    return interesseSalvo;
  }
}
