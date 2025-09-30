import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

import { moveToArchive } from "@/app/api";

interface MenuProps {
  documentId: number;
}

//ドキュメントの削除を行うボタンコンポーネント
//itemで使用する
export const Menu: React.FC<MenuProps> = ({ documentId }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => moveToArchive(documentId),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ["documentList"] });
      queryClient.invalidateQueries({ queryKey: ["archive"] });
      if (document.parentDocumentId === -1) {
        router.push("/documents");
      } else {
        router.push(`/documents/${document.parentDocumentId}`);
      }
    },
  });

  const handleDeleteClick = () => {
    mutation.mutateAsync();
    setIsPopoverOpen(false);
  };

  return (
    <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
      <PopoverTrigger>
        <button
          type="button"
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          onClick={(e) => {
            e.stopPropagation();
            setIsPopoverOpen(true);
          }}
        >
          <div style={dotStyle} />
          <div style={dotStyle} />
          <div style={dotStyle} />
        </button>
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text onClick={handleDeleteClick}>Delete</Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const dotStyle = {
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  backgroundColor: "black",
};
