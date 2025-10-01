"use client";
/* eslint-disable */

import { Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { useState } from "react";

import { InputField } from "./inputField";

interface SignupFormProps {
  onSignup: (userName: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

// Signup component
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
      const axiosLike = error as { response?: { data?: { message?: string } } } | undefined;
      const message = axiosLike?.response?.data?.message ?? "An unexpected error occurred";
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
          placeholder="Enter your user name"
        />
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
          SignUp
        </Button>
        <Text>
          Already have an account? 
          <button
            type="button"
            style={{
              color: "blue",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={onSwitchToLogin}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSwitchToLogin();
              }
            }}
          >
            Log in
          </button>
          instead.
        </Text>
      </Stack>
    </Flex>
  );
};
