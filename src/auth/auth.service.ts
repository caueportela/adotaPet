import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.userService.findByEmail(createAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const senhaValida = await bcrypt.compare(createAuthDto.senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { access_token, user };
  }
}
