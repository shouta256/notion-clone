import { ResolvingViewport } from 'next/dist/lib/metadata/types/metadata-interface.js';
import axios from 'axios';
import { UserData } from './type';
import { use } from 'react';

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
  const userIdResponse = await axiosInstance.get('auth/userId', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userId = userIdResponse.data;

  const user = await axiosInstance.get(`user/${userId}`);

  return user.data;
};
