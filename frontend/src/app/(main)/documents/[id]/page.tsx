'use client';

import { Box } from '@chakra-ui/react';

import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';

import { getDocumentById } from '@/app/api';
import { DocumentType } from '@/app/type';

import { DocumentTitle } from '@/components/documentTitle';
import { Editor } from '@/components/editor';

//各ドキュメントを表示するページ
export default function DocumentPage() {
  const param = useParams();
  const documentId = parseInt(
    Array.isArray(param.id) ? param.id[0] : param.id,
    10
  );

  const documentQueryResult = useQuery<DocumentType | undefined>(
    'document',
    () => getDocumentById(documentId),
    {
      cacheTime: 0,
    }
  );
  const { data: document, isLoading } = documentQueryResult;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box margin='100px'>
      {documentId && (
        <DocumentTitle documentId={documentId} title={document?.title ?? ''} />
      )}
      <Editor documentId={documentId} initialContent={document?.content} />
    </Box>
  );
}
