import axios from 'axios';
import { DocumentType, NestedDocuments, UserData } from './type';

const axiosInstance = axios.create({ baseURL: 'http://localhost:8080' });

export const login = async (
  email: string,
  password: string
): Promise<UserData> => {
  const inputData = { email: email, password: password };
  const response = await axiosInstance.post('/auth/login', inputData);
  return response.data;
};

export const signUp = async (
  userName: string,
  email: string,
  password: string
): Promise<UserData> => {
  const inputData = { userName: userName, email: email, password: password };
  const response = await axiosInstance.post('user', inputData);
  const loginData = {
    email: response.data.email,
    password: response.data.password,
  };
  return login(loginData.email, loginData.password);
};

export const getUser = async (token: string): Promise<UserData> => {
  console.log('トークンは', token);

  const userIdResponse = await axiosInstance.get('auth/userId', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userId = userIdResponse.data;

  const user = await axiosInstance.get(`user/${userId}`);

  return user.data;
};

export const createDocument = async (
  title: string,
  parentDocumentId?: number
): Promise<Document> => {
  const token = localStorage.getItem('token');
  const requestBody = { title: title, parentDocumentId: parentDocumentId };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const document = await axiosInstance.post('document', requestBody, config);

  return document.data;
};

export const getDocuments = async (): Promise<NestedDocuments[]> => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const documents = await axiosInstance.get('document', config);

  return documents.data;
};

export const moveToArchive = async (
  documentId: number
): Promise<DocumentType> => {
  const token = localStorage.getItem('token');
  console.log('Tokenは', token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axiosInstance.put(
    `document/archive/${documentId}`,
    config
  );
  console.log('レスポンス：', response.data);

  return response.data;
};

export const getDocumentById = async (
  documentId: number
): Promise<DocumentType> => {
  const document = await axiosInstance.get(`document/${documentId}`);

  return document.data;
};
