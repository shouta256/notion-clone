import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { NestedDocuments } from '@/app/type';

import { Item } from './item';

//ドキュメントの階層構造を再帰的に表示するコンポーネント
export const DocumentList: React.FC<{ documents: NestedDocuments[] }> = ({
  documents,
}) => {
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onRedirect = (documentId: number) => {
    router.push(`/documents/${documentId}`);
  };

  if (!documents) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {documents.length === 0 ? (
        <p>No pages inside</p>
      ) : (
        documents.map((document) => (
          <div key={document.id}>
            <Item
              title={document.title}
              documentId={document.id}
              onClick={() => onRedirect(document.id)}
              expanded={expanded[document.id]}
              setExpanded={(expanded) =>
                setExpanded((prevExpanded) => ({
                  ...prevExpanded,
                  [document.id]: expanded,
                }))
              }
            />

            {expanded[document.id] && (
              <div style={{ marginLeft: '15px' }}>
                <DocumentList documents={document.children} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
