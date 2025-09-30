import { Box, Flex, Icon, Text, useBoolean } from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { Menu } from './menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDocument } from '@/app/api';

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
  const [isHovered, setIsHovered] = useBoolean(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => createDocument('Untitle', documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentList'] });
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
      onMouseEnter={setIsHovered.on}
      onMouseLeave={setIsHovered.off}
      _hover={{ cursor: 'pointer', bg: 'gray.200' }}
    >
      <Flex justifyContent='space-between' alignItems='center' width='100%'>
        <Flex alignItems='center' flex='1' width='80%'>
          <Icon
            as={expanded ? ChevronDownIcon : ChevronRightIcon}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          />
          <Text
            marginLeft='2'
            fontWeight='500'
            isTruncated
            maxWidth='80%'
            overflow='hidden'
            whiteSpace='nowrap'
            textOverflow='ellipsis'
          >
            {title}
          </Text>
        </Flex>
        <Flex
          marginRight={2}
          justifyContent='flex-end'
          display={isHovered ? 'flex' : 'none'}
        >
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
