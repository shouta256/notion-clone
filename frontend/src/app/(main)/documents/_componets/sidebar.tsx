"use client";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  List,
  ListItem,
  Spacer,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { getArchive, getDocuments, getUser } from "@/app/api";
import type { DocumentType, NestedDocuments } from "@/app/type";

import { DeleteIcon } from "@/components/icons";
import { DocumentList } from "./documentList";
import { NewpageButton } from "./newpageButton";
import { Profile } from "./profile";

// ユーザ名、ドキュメントの階層を表示するコンポーネント
export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Cookieベースの認証に移行済みのため token は不要
  const userQueryResult = useQuery({ queryKey: ["user"], queryFn: () => getUser() });
  const { data: user, isLoading } = userQueryResult;

  // ドキュメントを取得
  const documentsQueryResult = useQuery<NestedDocuments[] | undefined>({
    queryKey: ["documentList"],
    queryFn: () => getDocuments(),
  });
  const { data: documents } = documentsQueryResult;
  const {
    data: archiveDocs,
    isLoading: isArchiveLoading,
    isError: isArchiveError,
  } = useQuery<DocumentType[]>({
    queryKey: ["archive"],
    queryFn: getArchive,
    enabled: isOpen,
  });

  useEffect(() => {
    if (!user && !isLoading) {
      redirect("/");
    }
  }, [user, isLoading]);

  return (
    <Box
      as="nav"
      bg="gray.100"
      color="black"
      width="250px"
      height="100vh"
      p="2"
      position="fixed"
      top="0"
      left="0"
      overflowY="auto"
      maxHeight="100vh"
    >
      <VStack spacing="4" align="stretch" height="100%">
        {user?.userName && !isLoading && <Profile userName={user.userName} />}

        <NewpageButton />

        {Array.isArray(documents) && documents.length !== 0 && (
          <DocumentList documents={documents} />
        )}

        <Spacer />
        {/* 下部固定のゴミ箱ボタン */}
        <Box position="sticky" bottom="0" bg="gray.100" pt="2" pb="2">
          <Button
            leftIcon={<DeleteIcon size={18} />}
            variant="ghost"
            w="100%"
            justifyContent="flex-start"
            onClick={onOpen}
          >
            ゴミ箱
          </Button>
        </Box>
      </VStack>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>アーカイブ</DrawerHeader>
          <DrawerBody>
            {isArchiveLoading && <Spinner />}
            {isArchiveError && <Text color="red.500">読み込みに失敗しました。</Text>}
            {!isArchiveLoading && !isArchiveError && (
              <List spacing={2}>
                {(archiveDocs ?? []).map((doc) => (
                  <ListItem
                    key={doc.id}
                    onClick={() => {
                      onClose();
                      window.location.href = `/documents/${doc.id}`;
                    }}
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                    p={1}
                    borderRadius="md"
                  >
                    {doc.title}
                  </ListItem>
                ))}
                {(!archiveDocs || archiveDocs.length === 0) && <Text>アーカイブは空です</Text>}
              </List>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
