import { AddIcon } from "@/components/icons";
import { Button, Icon } from "@chakra-ui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDocument } from "@/app/api";

//サイドバーに表示する新規ページのボタンコンポーネント
export const NewpageButton = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => createDocument("Untitle"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentList"] });
    },
  });

  const handleOnclick = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Button
      leftIcon={<Icon as={AddIcon} />}
      paddingLeft="1"
      paddingRight="2"
      fontSize="md"
      fontWeight="medium"
      width="100%"
      marginX="auto"
      textAlign="left"
      justifyContent="flex-start"
      onClick={handleOnclick}
    >
      New page
    </Button>
  );
};
