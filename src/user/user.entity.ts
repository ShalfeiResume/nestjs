import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  login: string;

  @Column({nullable: true})
  password: string;

  @Column({nullable: true})
  firstName: string;

  @Column({nullable: true})
  lastName: string;

  @Column({nullable: true})
  email: string;
}