"use client";

import { ChevronLeftIcon, DeleteIcon } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { deleteArchive, moveToRestore } from "@/app/api";
import type { DocumentType } from "@/app/type";

interface ArchiveDocumentProps {
  document: DocumentType;
}

export const ArchiveDocument = ({ document }: ArchiveDocumentProps) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const deleteMutation = useMutation({
    mutationFn: () => deleteArchive(document.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
      toast({ title: "Document deleted.", status: "success", duration: 2000, isClosable: true });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "An unexpected error occurred";
      toast({
        title: "Failed to delete document.",
        description: errorMessage,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => moveToRestore(document.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["archive"] });
      await queryClient.invalidateQueries({ queryKey: ["documentList"] });
      toast({ title: "Document restored.", status: "success", duration: 2000, isClosable: true });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "An unexpected error occurred";
      toast({
        title: "Failed to restore document.",
        description: errorMessage,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const handleNavigate = () => {
    router.push(`/documents/${document.id}`);
  };

  const handleDeleteIconClick = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    setIsConfirmOpen(false);
  };

  const handleRestoreIconClick = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    restoreMutation.mutate();
  };

  const handleAlertDialogClose = () => {
    setIsConfirmOpen(false);
  };

  return (
    <Box
      margin="1"
      width="100%"
      height="30px"
      onClick={handleNavigate}
      _hover={{ cursor: "pointer", bg: "gray.200" }}
    >
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Flex alignItems="center">
          <Text marginLeft="2" fontWeight="500">
            {document.title}
          </Text>
        </Flex>
        <Flex justifyContent="flex-end">
          <ChevronLeftIcon onClick={handleRestoreIconClick} />
          <Box ml="2">
            <DeleteIcon onClick={handleDeleteIconClick} />
          </Box>
        </Flex>
      </Flex>

      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleAlertDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Document
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to permanently delete this document? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
