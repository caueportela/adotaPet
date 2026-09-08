import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/baseEntity/base.entity.js';
import { Animal } from '../../animal/entities/animal.entity.js';
import { User } from '../../user/entities/user.entity.js';

export enum StatusInteresse {
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
}

@Entity('interesses')
export class Interesse extends BaseEntity {
  @ManyToOne(() => Animal)
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @Column()
  nomeInteressado: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column({ nullable: true })
  mensagem: string;

  @Column({
    type: 'enum',
    enum: StatusInteresse,
    default: StatusInteresse.PENDENTE,
  })
  status: StatusInteresse;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'analisado_por' })
  analisadoPor?: User;
}
