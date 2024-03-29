'use client';

import { Box, Flex } from '@chakra-ui/react';

import { Sidebar } from './_componets/sidebar';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex>
      <Sidebar />

      <Box ml='250px' p='4' flex='1'>
        {children}
      </Box>
    </Flex>
  );
}
