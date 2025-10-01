"use client";

import { Box } from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { getDocumentById } from "@/app/api";
import type { DocumentType } from "@/app/type";

import { DocumentTitle } from "@/components/documentTitle";
import { Editor } from "@/components/editor";
import type { PartialBlock } from "@blocknote/core";

//各ドキュメントを表示するページ
export default function DocumentPage() {
  const param = useParams();
  const documentId = Number.parseInt(Array.isArray(param.id) ? param.id[0] : param.id, 10);

  const documentQueryResult = useQuery<DocumentType | undefined>({
    queryKey: ["document", documentId],
    queryFn: () => getDocumentById(documentId),
    gcTime: 0,
  });
  const { data: document, isLoading } = documentQueryResult;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Coerce unknown content to PartialBlock[] if it's an array of objects
  const contentAsBlocks = Array.isArray(document?.content)
    ? (document?.content.filter(
        (b) => typeof b === "object" && b !== null,
      ) as unknown as PartialBlock[])
    : undefined;

  return (
    <Box margin="100px">
      {documentId && <DocumentTitle documentId={documentId} title={document?.title ?? ""} />}
      <Editor documentId={documentId} initialContent={contentAsBlocks} />
    </Box>
  );
}
