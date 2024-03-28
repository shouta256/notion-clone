export interface UserData {
  id: number;
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}

export interface DocumentType {
  id: number;
  title: string;
  parentDocumentId: number;
  idArchive: boolean;
  userId: number;
  content: JSON;
}

export interface NestedDocuments {
  id: number;
  title: string;
  children: NestedDocuments[];
}
