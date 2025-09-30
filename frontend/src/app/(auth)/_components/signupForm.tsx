"use client";

import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { useState } from "react";

import { InputField } from "./inputField";

interface SignupFormProps {
  onSignup: (userName: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

//サインアップ用コンポーネント
export const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await onSignup(userName, email, password);
    } catch (error: unknown) {
      const message = (error as any).response?.data?.message || "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" minHeight="100vh">
      <Stack spacing={4} textAlign="center" width="400px">
        <Heading>SignUp</Heading>
        {error && <Text color="red">{error}</Text>}{" "}
        <InputField
          label="user name"
          type="name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="ユーザ名を入力"
        />
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
          SignUp
        </Button>
        <Text>
          アカウントをお持ちの場合は、
          <span style={{ color: "blue", cursor: "pointer" }} onClick={onSwitchToLogin}>
            こちら
          </span>
          から新規登録してください。
        </Text>
      </Stack>
    </Flex>
  );
};
