import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../entities/user.entity.js";

export class CreateUserDto { 
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;

  @IsEnum(Role, { message: 'A role deve ser ADMIN ou FUNCIONARIO.' })
  @IsOptional()
  role?: Role;
}
