import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'refresh-tokens' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  data: string;
}
