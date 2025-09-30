import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", name: "title" })
  title: string;

  @Column({
    type: "int",
    name: "parent_document_id",
    nullable: true,
    default: null,
  })
  parentDocumentId: number | null;

  // Self reference: parent
  @ManyToOne(
    () => Document,
    (document) => document.children,
    {
      onDelete: "SET NULL",
      nullable: true,
    },
  )
  @JoinColumn({ name: "parent_document_id" })
  parent?: Document | null;

  // Self reference: children
  @OneToMany(
    () => Document,
    (document) => document.parent,
  )
  children?: Document[];

  @Column({ type: "int", default: -1 })
  userId: number;

  @Column({ type: "boolean", name: "is_archive", default: false })
  isArchive: boolean;

  @Column({ type: "json", nullable: true })
  content: unknown | null;

  @ManyToOne(
    () => User,
    (user) => user.documents,
  )
  user: User;
}
