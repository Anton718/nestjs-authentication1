import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auth_id: number;

  @Column()
  username: string;

  @Column()
  info: string;

  @Column()
  dateCreated: string;
}
