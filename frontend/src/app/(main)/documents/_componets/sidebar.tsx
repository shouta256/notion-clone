import { getDocuments, getUser } from '@/app/api';
import { NestedDocuments, UserData } from '@/app/type';
import { Box, Flex, VStack, Text, Spacer, IconButton } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NewpageButton } from './newpageButton';
import { useQuery } from 'react-query';
import { DocumentList } from './documentList';

const Sidebar = () => {
  const [token, setToken] = useState('');
  const userQueryResult = useQuery('user', () => getUser(token), {
    enabled: !!token,
  });
  const { data: user, isLoading } = userQueryResult;

  const documentsQueryResult = useQuery<NestedDocuments[] | undefined>(
    'documentList',
    () => getDocuments()
  );
  const { data: documents } = documentsQueryResult;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      redirect('/');
    }
    setToken(storedToken);
  }, []);

  return (
    <Box
      as='nav'
      bg='gray.100'
      color='black'
      width='250px'
      height='100vh'
      p='2'
      position='fixed'
      top='0'
      left='0'
    >
      <VStack spacing='4' align='stretch'>
        {isLoading ? (
          <Text fontSize='xl' fontWeight={500}>
            ...loading
          </Text>
        ) : (
          <Text fontSize='xl' fontWeight={500}>
            {user?.userName}&rsquo;s notion
          </Text>
        )}

        <NewpageButton />
        <DocumentList documents={documents!} />
      </VStack>
    </Box>
  );
};

export default Sidebar;
