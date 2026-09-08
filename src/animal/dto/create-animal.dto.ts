import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Especie, PorteAnimal, SexoAnimal } from "../entities/animal.entity.js";

 
 
 
 
export class CreateAnimalDto { 
 
@IsString()  
@IsNotEmpty({message: 'O animal precisar ser cadastrado com um nome.'})
nome: string
 
@IsString()
@IsOptional()
raca?: string

@IsNumber()
@IsNotEmpty({message: 'O animal precisar ser cadastrado com uma idade.'})
idade: number

@IsEnum(Especie, {message: 'A espécie deve ser CACHORRO ou GATO.'})
@IsNotEmpty()
especie: Especie

@IsEnum(SexoAnimal, {message: 'O animal deve ser MACHO ou FEMEA'})
@IsNotEmpty()
sexoAnimal: SexoAnimal

@IsEnum(PorteAnimal, {message: 'O animal deve ter porte PEQUENO ou MEDIO ou GRANDE.'})
@IsNotEmpty()
porte: PorteAnimal

@IsString()
@IsOptional()
descricao?: string

@IsString()
@IsOptional()
fotoUrl?: string

}
