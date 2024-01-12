import React, { useContext } from "react";
import { Box } from "@chakra-ui/react";

import { ChatContext } from "../../context/chatContext";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = useContext(ChatContext);

  return (
    <Box
      display={selectedChat ? "flex" : "none"}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#fff"
      w="100%"
      borderRadius="1g"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
