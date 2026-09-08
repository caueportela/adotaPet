import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/baseEntity/base.entity.js";
 
export enum SexoAnimal { 
    MACHO = 'MACHO', 
    FEMEA = 'FEMEA'
 }
  

export enum PorteAnimal{
    GRANDE = 'GRANDE',
    MEDIO = 'MEDIO',
    PEQUENO = 'PEQUENO',
 }


export enum Especie{
    CACHORRO = 'CACHORRO',
    GATO = 'GATO',
}

export enum StatusAnimal{
    DISPONIVEL = 'DISPONIVEL',
    EM_PROCESSO = 'EM_PROCESSO',
    ADOTADO = 'ADOTADO',
}
 
@Entity('animals') 
export class Animal extends BaseEntity { 
 
@Column() 
nome: string 

@Column({ nullable: true })
raca: string

@Column()
idade: number

@Column({ 
    type: 'enum', 
    enum: SexoAnimal, 
}) 
sexoAnimal: SexoAnimal; 


@Column({ 
    type: 'enum', 
    enum: PorteAnimal, 
}) 
porte: PorteAnimal;  

@Column({ 
    type: 'enum', 
    enum: Especie, 
}) 
especie : Especie; 

@Column({ nullable: true })
descricao: string

@Column({ nullable: true })
fotoUrl: string

@Column({ 
    type: 'enum', 
    enum: StatusAnimal, 
    default: StatusAnimal.DISPONIVEL
}) 
status: StatusAnimal 


}
