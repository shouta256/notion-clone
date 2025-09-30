import { Box, VStack } from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { getDocuments, getUser } from "@/app/api";
import type { NestedDocuments } from "@/app/type";

import { DocumentList } from "./documentList";
import { NewpageButton } from "./newpageButton";
import { Profile } from "./profile";

//ユーザ名、ドキュメントの階層を表示するコンポーネント
export const Sidebar = () => {
  // Cookieベースの認証に移行済みのため token は不要
  const userQueryResult = useQuery({ queryKey: ["user"], queryFn: () => getUser() });
  const { data: user, isLoading } = userQueryResult;

  //ドキュメントを取得
  const documentsQueryResult = useQuery<NestedDocuments[] | undefined>({
    queryKey: ["documentList"],
    queryFn: () => getDocuments(),
  });
  const { data: documents } = documentsQueryResult;

  useEffect(() => {
    // 認証されていなければサーバが 401 を返す前提で、ここでは単純にトップへ誘導したい場合だけ処理
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
      <VStack spacing="4" align="stretch">
        {user?.userName && !isLoading && <Profile userName={user.userName} />}

        <NewpageButton />
        {Array.isArray(documents) && documents.length !== 0 && (
          <DocumentList documents={documents} />
        )}
        {/* <TrashBox /> */}
      </VStack>
    </Box>
  );
};
