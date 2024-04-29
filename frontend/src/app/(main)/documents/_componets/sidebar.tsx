import { Box, VStack } from '@chakra-ui/react';

import { redirect } from 'next/navigation';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';

import { getDocuments, getUser } from '@/app/api';
import { NestedDocuments } from '@/app/type';

import { NewpageButton } from './newpageButton';
import { DocumentList } from './documentList';
import { Profile } from './profile';
import TrashBox from './trashBox';

//ユーザ名、ドキュメントの階層を表示するコンポーネント
export const Sidebar = () => {
  const [token, setToken] = useState('');

  //トークンからユーザを取得
  const userQueryResult = useQuery('user', () => getUser(token), {
    enabled: !!token,
  });
  const { data: user, isLoading } = userQueryResult;

  //ドキュメントを取得
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
      overflowY='auto'
      maxHeight='100vh'
    >
      <VStack spacing='4' align='stretch'>
        {user && user.userName && !isLoading && (
          <Profile userName={user.userName} />
        )}

        <NewpageButton />
        {documents?.length !== 0 && <DocumentList documents={documents!} />}
        <TrashBox />
      </VStack>
    </Box>
  );
};
