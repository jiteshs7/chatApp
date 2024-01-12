import { Avatar, Tooltip } from "@chakra-ui/react";
import { m } from "framer-motion";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../../context/chatContext";
import {
  isLastMsg,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../utility/utils";

const ScrollabelChat = ({ messages }) => {
  const { user } = useContext(ChatContext);

  if (!messages || !messages.length) return <div>No chats found!</div>;
  return (
    <ScrollableFeed>
      {messages.map((msg, index) => (
        <div style={{ display: "flex" }} key={msg._id}>
          {(isSameSender(messages, msg, index, user._id) ||
            isLastMsg(messages, index, user._id)) && (
            <Tooltip label={msg.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={msg.sender.name}
                src={msg.sender.profilePic}
              />
            </Tooltip>
          )}

          <span
            style={{
              backgroundColor: `${
                msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginLeft: isSameSenderMargin(messages, msg, index, user._id),
              marginTop: isSameUser(messages, msg, index, user._id) ? 3 : 10,
            }}
          >
            {msg.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollabelChat;
