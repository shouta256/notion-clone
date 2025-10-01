"use client";

import { AddIcon } from "@/components/icons";
import { Box, Button, Center, Heading, Icon } from "@chakra-ui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createDocument } from "@/app/api";

//ユーザがドキュメントを持っていないときに表示されるページ
//新規ドキュメントを作成できる
export default function DocumentsPage() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => createDocument("Untitle"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documentList"] });
      router.push(`/documents/${data.id}`);
    },
  });

  const handleOnclick = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Center height="90vh">
      <Box textAlign="center">
        <Heading marginY="50px">Welcome to Notion</Heading>
        <Button
          mt="4"
          color="white"
          backgroundColor="black"
          leftIcon={<Icon as={AddIcon} />}
          onClick={handleOnclick}
          _hover={{ backgroundColor: "gray.800" }}
        >
          Create a note
        </Button>
      </Box>
    </Center>
  );
}
