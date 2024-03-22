import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true, default: -1 })
  parentDocumentId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
