import React, { useEffect, useContext, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Text,
  Spinner,
  FormControl,
  Input,
} from "@chakra-ui/react";
import Lottie from "react-lottie";

import io from "socket.io-client";

import { ChatContext } from "../../context/chatContext";
import { getSender, getSenderFull } from "../../utility/utils";

import UpdateGroupChatModal from "../models/UpdateGroupChatModal";
import ProfileModal from "../profile/ProfileModal";
import ScrollabelChat from "./ScrollabelChat";

import axios from "../../api/Api";

import "../../styles/styles.css";

const END_POINT = "http://localhost:8080";

let socket, selectedChatCompare;

const DEFAULT_OPTIONS = {
  loop: true,
  autoplay: true,
  animationData: "../",
  renderSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    notifications,
    setNotifications,
    setSelectedChat,
  } = useContext(ChatContext);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    handleNotifications();
  }, [selectedChat]);

  useEffect(() => {
    setUpSocket();
  }, []);

  useEffect(() => {
    socket.on("message_received", (newMsg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMsg.chat._id) {
        // Show notification
        if (!notifications.includes(newMsg)) {
          setNotifications((prev) => [newMsg, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages([...messages, newMsg]);
      }
    });
  });

  const handleNotifications = () => {
    if (notifications.length) {
      const newNotifications = notifications.filter(
        (notif) => notif.chat._id !== selectedChat._id
      );

      setNotifications(newNotifications);
    }
  };

  const setUpSocket = () => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", (userId) => {
      if (userId === user._id) return;
      setIsTyping(true);
    });
    socket.on("stop_typing", () => setIsTyping(false));
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setIsLoading(true);
    try {
      // Need to check another way to send data as a param
      const result = await axios.get(`/message/${selectedChat._id}`);
      setMessages(result.data.data);
      setIsLoading(false);
      socket.emit("join_chat", selectedChat._id);
    } catch (error) {
      console.log("SingleChat.js fetchMessages() Error=", error);
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        socket.emit("stop_typing", selectedChat._id);
        const result = await axios.post("/message", {
          content: newMessage,
          chatId: selectedChat._id,
        });
        socket.emit("new_message", result.data.data);
        setMessages([...messages, result.data.data]);
      } catch (error) {
        console.log("SingleChat.js sendMessage() Error=", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id, user._id);
    }

    // Debouncing function for better ux
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop_typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  if (!selectedChat) {
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a chat to start chatting.
          </Text>
        </Box>
      </>
    );
  }

  return (
    <Box display="flex" width="100%" height="100%" flexDir="column">
      <Text
        fontSize="28px"
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton
          display="flex"
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
        />
        {!selectedChat.isGroupChat ? (
          <>
            {getSender(selectedChat.users, user)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </>
        ) : (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              fetchMessages={fetchMessages}
            />
          </>
        )}
      </Text>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgColor="#E8E8E8"
        w="100%"
        h="100%"
        borderRadius="1g"
        overflowY="hidden"
      >
        {isLoading ? (
          <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
        ) : (
          <Box className="messages">
            <ScrollabelChat messages={messages} />
          </Box>
        )}
        <FormControl onKeyDown={sendMessage}>
          {isTyping && <div>Typing...</div>}
          {/* {isTyping && (
            <Lottie
              options={DEFAULT_OPTIONS}
              style={{ marginLeft: 0, marginBottom: 15, width: 70 }}
            />
          )} */}
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message..."
            onChange={typingHandler}
            value={newMessage}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default SingleChat;
