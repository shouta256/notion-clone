import axios from 'axios';
import { UserData } from './type';

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
