"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { login, signUp } from "../api";

import { LoginForm } from "./_components/loginForm";
import { SignupForm } from "./_components/signupForm";

//ログイン・サインアップをするページ
export default function Auth() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  //ログインメソッド
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    router.push("/documents");
  };

  //サインアップメソッド
  const handleSignup = async (userName: string, email: string, password: string) => {
    await signUp(userName, email, password);
    router.push("/documents");
  };

  return (
    <div>
      {isLogin ? (
        <div>
          <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setIsLogin(false)} />
        </div>
      ) : (
        <div>
          <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setIsLogin(true)} />
        </div>
      )}
    </div>
  );
}
