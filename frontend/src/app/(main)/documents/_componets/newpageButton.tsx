import { Flex, Button, Icon } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { createDocument } from '@/app/api';
import { useMutation, useQueryClient } from 'react-query';

export const NewpageButton = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => createDocument('Untitle'), {
    onSuccess: () => {
      queryClient.invalidateQueries('documentList');
    },
  });
  const handleOnclick = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Button
      leftIcon={<Icon as={AddIcon} />}
      paddingLeft='1'
      paddingRight='2'
      fontSize='md'
      fontWeight='medium'
      width='100%'
      marginX='auto'
      textAlign='left'
      justifyContent='flex-start'
      onClick={handleOnclick}
    >
      New page
    </Button>
  );
};
