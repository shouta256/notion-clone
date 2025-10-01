import axios from "axios";
import type { DocumentType, NestedDocuments, UserData } from "./type";

// Normalize backend URL so we don't depend on trailing slash configuration in env files
const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
const normalizedBackendUrl = rawBackendUrl.endsWith("/") ? rawBackendUrl : `${rawBackendUrl}/`;

const axiosInstance = axios.create({
  baseURL: `${normalizedBackendUrl}api/`,
  withCredentials: true,
});

export const login = async (email: string, password: string): Promise<UserData> => {
  const inputData = { email: email, password: password };
  const response = await axiosInstance.post("auth/login", inputData);
  return response.data;
};

export const signUp = async (
  userName: string,
  email: string,
  password: string,
): Promise<UserData> => {
  const inputData = { userName: userName, email: email, password: password };
  await axiosInstance.post("user", inputData);
  // Use original credentials to login; backend never returns plaintext password
  return login(email, password);
};

export const getUser = async (_token?: string): Promise<UserData> => {
  const user = await axiosInstance.get("auth/authenticate");
  return user.data;
};

export const createDocument = async (
  title: string,
  parentDocumentId?: number,
): Promise<DocumentType> => {
  const requestBody = { title: title, parentDocumentId: parentDocumentId };
  const document = await axiosInstance.post("document", requestBody);

  return document.data;
};

export const updateDocument = async (
  documentId: number,
  title?: string,
  content?: unknown,
): Promise<DocumentType> => {
  const requestBody = { id: documentId, title: title, content: content };

  const response = await axiosInstance.patch("document", requestBody);
  return response.data;
};

export const getDocuments = async (): Promise<NestedDocuments[]> => {
  const documents = await axiosInstance.get("document");

  return documents.data;
};

export const moveToArchive = async (documentId: number): Promise<DocumentType> => {
  const response = await axiosInstance.put(`document/archive/${documentId}`);

  return response.data;
};

export const getArchive = async (): Promise<DocumentType[]> => {
  const response = await axiosInstance.get("document/archive");

  return response.data;
};

export const deleteArchive = async (documentId: number): Promise<DocumentType> => {
  const response = await axiosInstance.delete(`document/archive/${documentId}`);

  return response.data;
};

export const moveToRestore = async (documentId: number): Promise<DocumentType> => {
  const response = await axiosInstance.patch(`document/restore/${documentId}`, {});

  return response.data;
};

export const getDocumentById = async (documentId: number): Promise<DocumentType> => {
  const document = await axiosInstance.get(`document/${documentId}`);

  return document.data;
};
