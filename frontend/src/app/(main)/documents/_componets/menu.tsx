import { createDocument, moveToArchive } from '@/app/api';
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface MenuProps {
  documentId: number;
}

export const Menu: React.FC<MenuProps> = ({ documentId }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation(() => moveToArchive(documentId), {
    onSuccess: (document) => {
      queryClient.invalidateQueries('documentList');
      if (document.parentDocumentId === -1) {
        router.push('/documents');
      } else {
        router.push(`/documents/${document.parentDocumentId}`);
      }
    },
  });

  const handleDeleteClick = () => {
    mutation.mutateAsync();
    setIsPopoverOpen(false);
  };

  return (
    <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
      <PopoverTrigger>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsPopoverOpen(true);
          }}
        >
          <div style={dotStyle}></div>
          <div style={dotStyle}></div>
          <div style={dotStyle}></div>
        </div>
      </PopoverTrigger>
      <PopoverContent width='200px'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text onClick={handleDeleteClick}>Delete</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const dotStyle = {
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  backgroundColor: 'black',
};
