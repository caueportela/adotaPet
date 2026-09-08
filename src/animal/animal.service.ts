import { Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class AnimalService {
 constructor( 
    @InjectRepository(Animal) 
    private readonly animalRepository: Repository<Animal>, 
 ){} 

 async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
  const novoAnimal = this.animalRepository.create(createAnimalDto)

  return this.animalRepository.save(novoAnimal)
 }
 
}
 

