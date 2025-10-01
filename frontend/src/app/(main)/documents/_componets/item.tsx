import { createDocument } from "@/app/api";
import { AddIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon, Text, useBoolean } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu } from "./menu";

interface ItemProps {
  title: string;
  documentId: number;
  onClick: () => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Item: React.FC<ItemProps> = ({
  title,
  documentId,
  onClick,
  expanded,
  setExpanded,
}) => {
  const [isHovered, setIsHovered] = useBoolean(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => createDocument("Untitle", documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentList"] });
    },
  });

  const handleAddIconClick = async () => {
    await mutation.mutateAsync();
    setExpanded(true);
  };

  return (
    <Box
      margin="1"
      width="100%"
      height="30px"
      onClick={onClick}
      onMouseEnter={setIsHovered.on}
      onMouseLeave={setIsHovered.off}
      _hover={{ cursor: "pointer", bg: "gray.200" }}
    >
      <Flex alignItems="center" width="100%" justifyContent="space-between">
        {/* Left: caret + truncated title */}
        <Flex alignItems="center" flex="1" minW={0} pr={2}>
          <Icon
            as={expanded ? ChevronDownIcon : ChevronRightIcon}
            flexShrink={0}
            mr={1}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          />
          <Text
            marginLeft="2"
            fontWeight="500"
            isTruncated
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {title}
          </Text>
        </Flex>

        {/* Right: actions (reserve space, don't shrink) */}
        <Flex
          marginRight={2}
          justifyContent="flex-end"
          visibility={isHovered ? "visible" : "hidden"}
          flexShrink={0}
          gap={2}
        >
          <Menu documentId={documentId} />
          <Icon
            as={AddIcon}
            onClick={(e) => {
              e.stopPropagation();
              handleAddIconClick();
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
