import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusAnimal } from '../entities/animal.entity.js';

export class UpdateAnimalStatusDto {
  @IsNotEmpty()
  @IsEnum(StatusAnimal, {
    message: 'O status deve ser DISPONIVEL, EM_PROCESSO ou ADOTADO.',
  })
  status: StatusAnimal;
}
