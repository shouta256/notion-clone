"use client";

import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { useState } from "react";

import { InputField } from "./inputField";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

//ログイン用のコンポーネント
export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await onLogin(email, password);
    } catch (error) {
      setError("ユーザー名またはパスワードが正しくありません。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" minHeight="100vh">
      <Stack spacing={4} textAlign="center" width="400px">
        <Heading>Login</Heading>
        {error && <Text color="red">{error}</Text>}{" "}
        <InputField
          label="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
        />
        <InputField
          label="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
        />
        <Button colorScheme="blue" onClick={handleLogin} isLoading={loading}>
          ログイン
        </Button>
        <Text>
          アカウントをお持ちでない場合は、
          <span style={{ color: "blue", cursor: "pointer" }} onClick={onSwitchToSignup}>
            こちら
          </span>
          から新規登録してください。
        </Text>
      </Stack>
    </Flex>
  );
};
