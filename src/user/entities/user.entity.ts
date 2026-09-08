import { Column, Entity } from "typeorm";
import { Exclude } from "class-transformer";
import { BaseEntity } from "../../common/baseEntity/base.entity.js";

export enum Role {
  ADMIN = 'ADMIN',
  FUNCIONARIO = 'FUNCIONARIO',
}
@Entity('users')
export class User extends BaseEntity {

    @Column()
    nome: string

    @Column()
    email: string

    @Column()
    @Exclude()
    senha: string

    @Column({
  type: 'enum',
  enum: Role,
  default: Role.FUNCIONARIO, 
})
role: Role; 
    


}
