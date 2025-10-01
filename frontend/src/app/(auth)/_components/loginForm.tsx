"use client";

import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { useState } from "react";

import { InputField } from "./inputField";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
}

// Login component
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
      setError("Email or password is incorrect.");
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
          placeholder="Enter your email"
        />
        <InputField
          label="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button colorScheme="blue" onClick={handleLogin} isLoading={loading}>
          Login
        </Button>
        <Text>
          Don’t have an account?
          <button
            type="button"
            style={{
              color: "blue",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={onSwitchToSignup}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSwitchToSignup();
              }
            }}
          >
            Sign up
          </button>
          instead.
        </Text>
      </Stack>
    </Flex>
  );
};
