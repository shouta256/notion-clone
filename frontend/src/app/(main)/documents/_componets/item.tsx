import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useMutation, useQueryClient } from 'react-query';
import { createDocument } from '@/app/api';
import { Menu } from './menu';

interface ItemProps {
  title: string;
  documentId: number;
  onClick: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Item: React.FC<ItemProps> = ({
  title,
  documentId,
  onClick,
  expanded,
  setExpanded,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(() => createDocument('Untitle', documentId), {
    onSuccess: () => {
      queryClient.invalidateQueries('documentList');
    },
  });

  const handleAddIconClick = async () => {
    await mutation.mutateAsync();
    setExpanded(true);
  };

  return (
    <Box
      margin='1'
      width='100%'
      height='30px'
      onClick={onClick}
      _hover={{ cursor: 'pointer', bg: 'gray.200' }}
    >
      <Flex justifyContent='space-between' alignItems='center' width='100%'>
        <Flex alignItems='center'>
          <Icon
            as={expanded ? ChevronDownIcon : ChevronRightIcon}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          />

          <Text marginLeft='2' fontWeight='500'>
            {title}
          </Text>
        </Flex>
        <Flex justifyContent='flex-end'>
          <Menu documentId={documentId} />
          <AddIcon
            marginLeft='2'
            onClick={(e) => {
              e.stopPropagation();
              handleAddIconClick();
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
