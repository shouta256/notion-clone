import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'user_name' })
  userName: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({
    type: 'varchar',
    name: 'password',
    length: 200,
    nullable: false,
    default: '',
    select: false,
  })
  password: string;

  @CreateDateColumn({
    type: 'datetime',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[];
}
