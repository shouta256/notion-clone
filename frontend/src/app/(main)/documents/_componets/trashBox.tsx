import { useRef, useState } from 'react';
import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { DocumentType } from '@/app/type';
import { getArchive } from '@/app/api';
import { useQuery } from 'react-query';
import { ArchiveDocument } from './archiveDocumet';

const TrashBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef(null);

  const { data: documents } = useQuery<DocumentType[] | undefined>(
    'archive',
    getArchive
  );

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnOpen = async () => {
    setIsOpen(true);
  };

  return (
    <Box>
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={handleOnOpen}
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Button
            ref={openButtonRef}
            leftIcon={<Icon as={FaTrash} color='gray.600' />}
            paddingLeft='1'
            paddingRight='2'
            fontSize='md'
            fontWeight='medium'
            width='100%'
            marginX='auto'
            textAlign='left'
            justifyContent='flex-start'
            onClick={handleClick}
          >
            Trash
          </Button>
        </PopoverTrigger>
        <PopoverContent overflowY='auto' maxHeight='400px' left='250px'>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Trash</PopoverHeader>
          <PopoverBody>
            {documents && documents.length > 0 ? (
              documents.map((document) => (
                <ArchiveDocument
                  key={document.id}
                  document={document}
                  setIsPopoverOpen={setIsOpen}
                />
              ))
            ) : (
              <Text>No documents in the trash</Text>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default TrashBox;
