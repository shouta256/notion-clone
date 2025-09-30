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
  parentDocumentId: number;
  idArchive: boolean;
  userId: number;
  content: unknown;
}

export interface NestedDocuments {
  id: number;
  title: string;
  children: NestedDocuments[];
}
