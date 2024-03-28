'use client';

import { createDocument } from '@/app/api';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Heading, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

export default function DocumentsPage() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation(() => createDocument('Untitle'), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('documentList');
      router.push(`/documents/${data.id}`);
    },
  });

  const handleOnclick = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Center height='90vh'>
      <Box textAlign='center'>
        <Heading marginY='50px'>Welcome to Notion</Heading>
        <Button
          mt='4'
          color='white'
          backgroundColor='black'
          leftIcon={<Icon as={AddIcon} />}
          onClick={handleOnclick}
          _hover={{ backgroundColor: 'gray.800' }}
        >
          Create a note
        </Button>
      </Box>
    </Center>
  );
}
