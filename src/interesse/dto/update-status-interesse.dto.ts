import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusInteresse } from '../entities/interesse.entity.js';

export class UpdateStatusInteresseDto {
  @IsEnum(StatusInteresse, { message: 'Status inválido.' })
  @IsNotEmpty()
  status: StatusInteresse;
}
