"use client";

import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileProps {
  userName: string;
}

//ユーザ名の表示とログアウトをするコンポーネント
export const Profile = ({ userName }: ProfileProps) => {
  const router = useRouter();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  //ログアウトメソッド
  const handleLogOutClick = () => {
    router.push("/");
  };
  return (
    <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
      <PopoverTrigger>
        <Text
          fontSize="xl"
          fontWeight={500}
          cursor="default"
          _hover={{ bg: "gray.200" }}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          {userName}&rsquo;s notion
        </Text>
      </PopoverTrigger>
      <PopoverContent width="200px" borderWidth="0" borderColor="black">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text
            width="85%"
            cursor="default"
            _hover={{ bg: "gray.200" }}
            onClick={handleLogOutClick}
          >
            Log out
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
