import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../interfaces';

@Entity({ name: 'users' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('text')
  address: string;
}
