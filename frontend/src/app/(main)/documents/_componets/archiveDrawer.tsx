"use client";

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getArchive } from "@/app/api";
import type { DocumentType } from "@/app/type";

interface ArchiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveDrawer: React.FC<ArchiveDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<DocumentType[]>({
    queryKey: ["archive"],
    queryFn: getArchive,
    enabled: isOpen,
  });

  const onClickItem = (id: number) => {
    onClose();
    router.push(`/documents/${id}`);
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>アーカイブ</DrawerHeader>
        <DrawerBody>
          {isLoading && <Spinner />}
          {isError && <Text color="red.500">読み込みに失敗しました。</Text>}
          {!isLoading && !isError && (
            <List spacing={2}>
              {(data ?? []).map((doc) => (
                <ListItem
                  key={doc.id}
                  onClick={() => onClickItem(doc.id)}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  p={1}
                  borderRadius="md"
                >
                  {doc.title}
                </ListItem>
              ))}
              {(!data || data.length === 0) && <Text>アーカイブは空です</Text>}
            </List>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
