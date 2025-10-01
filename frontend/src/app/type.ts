import type { PartialBlock } from "@blocknote/core";
export interface UserData {
  id: number;
  userName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentType {
  id: number;
  title: string;
  parentDocumentId: number | null;
  isArchive: boolean;
  userId: number;
  content: PartialBlock[] | undefined;
}

export interface NestedDocuments {
  id: number;
  title: string;
  children: NestedDocuments[];
}
