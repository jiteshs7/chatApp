import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SECRET_USERINFO_KEY } from "../utility/constants";

export const ChatContext = createContext({
  user: {},
  selectedChat: false,
  chats: [],
  notifications: [],
  setChats: () => {},
  setSelectedChat: () => {},
  setNotifications: () => {},
});

const ChatCtxt = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChat, setSelectedChat] = useState(false);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem(SECRET_USERINFO_KEY));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        selectedChat,
        chats,
        notifications,
        setNotifications,
        setChats,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatCtxt;
