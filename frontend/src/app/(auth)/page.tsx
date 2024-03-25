'use client';
import {
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Heading,
  CircularProgress,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { login } from '../api';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);
      console.log('ログイン成功:', user);
      console.log('ユーザID', user.id);
      localStorage.setItem('token', user.token);
      console.log('tokenは', localStorage.getItem('token'));
      router.push('/documents');
    } catch (error) {
      setError('ユーザー名またはパスワードが正しくありません。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align='center' justify='center' minHeight='100vh'>
      <Stack spacing={4} textAlign='center'>
        <Heading>Login</Heading>
        {error && <Text color='red'>{error}</Text>}{' '}
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='メールアドレスを入力'
            width='400px'
          />
        </FormControl>
        <FormControl>
          <FormLabel>password</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='パスワードを入力'
            width='400px'
          />
        </FormControl>
        <Button colorScheme='blue' onClick={handleLogin}>
          ログイン
        </Button>
      </Stack>
    </Flex>
  );
}
