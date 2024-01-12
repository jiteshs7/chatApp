import React, { useContext, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { ChatContext } from "../context/chatContext";

import axios from "../api/Api";
import Sidebar from "../components/chat/Sidebar";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";

const Chats = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  if (!user) return <div>Not authorized!</div>;

  return (
    <div style={{ width: "100%" }}>
      <Sidebar />
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  );
};

export default Chats;
