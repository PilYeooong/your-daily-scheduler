import { CoreEntity } from './core.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export default class User extends CoreEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}