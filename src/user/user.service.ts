import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService { 
  constructor( 
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ){} 


  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailExists = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      },
    });
    if (emailExists) {
      throw new ConflictException("E-mail já cadastrado.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.senha, salt);

    const novoUser = this.userRepository.create({
      ...createUserDto,
      senha: hashedPassword,
    });

    return this.userRepository.save(novoUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
