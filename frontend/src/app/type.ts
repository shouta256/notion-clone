export interface UserData {
  id: number;
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
}

export interface Document {
  id: number;
  title: string;
  parentDocumentId: number;
  idArchive: boolean;
  userId: number;
  content: JSON;
}
