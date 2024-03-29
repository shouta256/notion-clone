'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { login, signUp } from '../api';

import { LoginForm } from './_components/loginForm';
import { SignupForm } from './_components/signupForm';

//ログイン・サインアップをするページ
export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  //ログインメソッド
  const handleLogin = async (email: string, password: string) => {
    const user = await login(email, password);
    localStorage.setItem('token', user.token);
    router.push('/documents');
  };

  //サインアップメソッド
  const handleSignup = async (
    userName: string,
    email: string,
    password: string
  ) => {
    const newUser = await signUp(userName, email, password);
    localStorage.setItem('token', newUser.token);
    router.push('/documents');
  };

  return (
    <div>
      {isLogin ? (
        <div>
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        </div>
      ) : (
        <div>
          <SignupForm
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        </div>
      )}
    </div>
  );
}
