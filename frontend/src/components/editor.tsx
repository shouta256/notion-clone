import { updateDocument } from '@/app/api';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';
import { useMutation, useQueryClient } from 'react-query';

interface EditorProps {
  documentId: number;
  initialContent: any;
}

export const Editor = ({ documentId, initialContent }: EditorProps) => {
  const editor = useCreateBlockNote({ initialContent: initialContent });
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newValue: any) => updateDocument(documentId, undefined, newValue),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('documentList');
      },
    }
  );
  const handleOnChange = async () => {
    try {
      await mutation.mutateAsync(editor.document);
    } catch (error) {
      console.error('APIでのデータ更新中にエラーが発生しました:', error);
    }
  };

  return (
    <div>
      <BlockNoteView editor={editor} onChange={handleOnChange} theme='light' />
    </div>
  );
};
