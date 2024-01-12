import React, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "../../api/Api";

import { ChatContext } from "../../context/chatContext";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "../models/GroupChatModal";
import { getSender } from "../../utility/utils";
const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, chats, setChats, setSelectedChat } =
    useContext(ChatContext);

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const fetchChats = useCallback(() => {
    setIsLoading(true);
    axios
      .get("/chats")
      .then((resp) => {
        setChats(resp?.data.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("MyChats.js fetchChats() ERROR", err);
        setIsLoading(false);
      });
  }, [setIsLoading, setChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display="flex"
      // display={selectedChat ? "none" : "flex"}
      // display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#fff"
      w="100%"
      minW="31%"
      // w={{ base: "100%", md: "31%" }}
      borderRadius="1g"
      borderWidth="1px"
    >
      {" "}
      <Box
        pb={3}
        px={3}
        fontSize="28px"
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button display="flex" fontSize="15px" rightIcon={<AddIcon />}>
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="1g"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "#fff" : "#000"}
                px={3}
                py={2}
                _hover={{
                  backgroundColor: "#3882AC",
                  color: "#fff",
                }}
                borderRadius="1g"
                cursor="pointer"
                onClick={() => setSelectedChat(chat)}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(chat.users, user)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
