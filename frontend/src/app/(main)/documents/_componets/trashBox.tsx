"use client";

import {
  Box,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";

import { getArchive } from "@/app/api";
import type { DocumentType } from "@/app/type";

import { ArchiveDocument } from "./archiveDocumet";

const TrashBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);

  const { data: documents } = useQuery<DocumentType[]>({
    queryKey: ["archive"],
    queryFn: getArchive,
  });

  const handleClick = () => setIsOpen((prev) => !prev);

  return (
    <Box>
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocusRef={openButtonRef}
        placement="right-start"
      >
        <PopoverTrigger>
          <Button
            ref={openButtonRef}
            leftIcon={<Icon as={FaTrash} color="gray.600" />}
            p="1"
            fontSize="md"
            fontWeight="medium"
            w="100%"
            justifyContent="flex-start"
            onClick={handleClick}
          >
            Trash
          </Button>
        </PopoverTrigger>
        <Portal>
          <PopoverContent p="5" width="sm" overflowY="auto" maxHeight="400px" zIndex="tooltip">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Trash</PopoverHeader>
            <PopoverBody>
              {documents && documents.length > 0 ? (
                documents.map((document) => (
                  <ArchiveDocument key={document.id} document={document} />
                ))
              ) : (
                <Text>No documents in the trash</Text>
              )}
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Box>
  );
};

export default TrashBox;
