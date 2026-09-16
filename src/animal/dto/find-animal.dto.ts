import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Especie, PorteAnimal, SexoAnimal, StatusAnimal } from '../entities/animal.entity.js';

export class FindAnimalDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEnum(Especie, { message: 'A espécie deve ser CACHORRO ou GATO.' })
  especie?: Especie;

  @IsOptional()
  @IsEnum(PorteAnimal, { message: 'O porte deve ser PEQUENO, MEDIO ou GRANDE.' })
  porte?: PorteAnimal;

  @IsOptional()
  @IsEnum(SexoAnimal, { message: 'O sexo deve ser MACHO ou FEMEA.' })
  sexoAnimal?: SexoAnimal;

  @IsOptional()
  @IsEnum(StatusAnimal, { message: 'Status inválido.' })
  status?: StatusAnimal;
}
