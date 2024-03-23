import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({
    type: 'int',
    name: 'parent_document_id',
    nullable: true,
    default: -1,
  })
  parentDocumentId: number;

  @Column({ type: 'int', default: -1 })
  userId: number;

  @Column({ type: 'boolean', name: 'is_archive', default: false })
  isArchive: boolean;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;
}
