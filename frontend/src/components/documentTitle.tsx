"use client";

import { updateDocument } from "@/app/api";
import { Box, Input } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface DocumentTitleProps {
  documentId: number;
  title: string;
}

export const DocumentTitle = ({ documentId, title }: DocumentTitleProps) => {
  const [value, setValue] = useState(title);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newValue: string) => updateDocument(documentId, newValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentList"] });
    },
  });

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    await mutation.mutateAsync(newValue);
  };

  return (
    <Box marginY="50px" marginLeft="50px">
      <Input
        value={value}
        placeholder="Untitle"
        fontSize="50"
        fontWeight="bold"
        variant="unstyled"
        onChange={handleOnChange}
      />
    </Box>
  );
};
