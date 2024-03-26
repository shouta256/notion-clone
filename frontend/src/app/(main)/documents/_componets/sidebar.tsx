import { getUser } from '@/app/api';
import { UserData } from '@/app/type';
import { Box, Flex, VStack, Text, Spacer, IconButton } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NewpageButton } from './newpageButton';

const Sidebar = () => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        redirect('/');
      }
      const user = await getUser(token);
      setUser(user);
      console.log('取得したuser:', user);
    };

    fetchUserData();
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
        <Text fontSize='xl' fontWeight={500}>
          {user?.userName}&rsquo;s notion
        </Text>

        <NewpageButton />
        <Text>Menu Item 1</Text>
        <Text>Menu Item 2</Text>
        <Text>Menu Item 3</Text>
      </VStack>
    </Box>
  );
};

export default Sidebar;
