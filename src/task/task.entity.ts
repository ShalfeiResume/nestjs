import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  date: number;

  @Column({nullable: true})
  time: number;

  @Column({nullable: true})
  description: string;

}