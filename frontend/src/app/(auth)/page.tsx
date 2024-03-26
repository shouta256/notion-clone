'use client';

import { useState } from 'react';
import { login, signUp } from '../api';
import { useRouter } from 'next/navigation';
import { LoginForm } from './_components/loginForm';
import { SignupForm } from './_components/signupForm';

export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (email: string, password: string) => {
    const user = await login(email, password);
    console.log('ログイン成功:', user);
    console.log('ユーザID', user.id);
    localStorage.setItem('token', user.token);
    console.log('tokenは', localStorage.getItem('token'));
    router.push('/documents');
  };

  const handleSignup = async (
    userName: string,
    email: string,
    password: string
  ) => {
    const newUser = await signUp(userName, email, password);
    console.log('サインアップ成功:', newUser);
    console.log('ユーザID', newUser.id);
    localStorage.setItem('token', newUser.token);
    console.log('tokenは', localStorage.getItem('token'));
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
