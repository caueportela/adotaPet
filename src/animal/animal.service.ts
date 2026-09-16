import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity.js';
import { ILike, Repository } from 'typeorm';
import { FindAnimalDto } from './dto/find-animal.dto.js';

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
  
async findAll(query: FindAnimalDto): Promise<Animal[]> {
  const { nome, especie, porte, sexoAnimal, status } = query;

  return this.animalRepository.find({
    where: {
      ...(nome && { nome: ILike(`%${nome}%`) }),
      ...(especie && { especie }),
      ...(porte && { porte }),
      ...(sexoAnimal && { sexoAnimal }),
      ...(status && { status }),
       },
  });
}

async findOne(id: string): Promise<Animal> {  
const animal = await this.animalRepository.findOne({ 
   where: {id} 
});  
if (!animal) { 
   throw new NotFoundException('Animal não encontrado.')
} 
return animal
}




}
 

