import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInteresseDto {
  @IsUUID()
  @IsNotEmpty({ message: 'É necessário informar o animal de interesse.' })
  animalId: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do interessado é obrigatório.' })
  nomeInteressado: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  telefone: string;

  @IsString()
  @IsOptional()
  mensagem?: string;
}
