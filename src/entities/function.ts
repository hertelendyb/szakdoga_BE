import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Function {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
