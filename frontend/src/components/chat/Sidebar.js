import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import { ChatContext } from "../../context/chatContext";
import { SECRET_USERINFO_KEY } from "../../utility/constants";
import ProfileModal from "../profile/ProfileModal";
import axios from "../../api/Api";
import ChatLoading from "./ChatLoading";
import UserListItem from "../user/UserListItem";
import { getSender } from "../../utility/utils";

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const {
    user,
    chats,
    notifications,
    setNotifications,
    setChats,
    setSelectedChat,
  } = useContext(ChatContext);

  const navigate = useNavigate();

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem(SECRET_USERINFO_KEY);
    navigate("/");
  };

  const handleSearch = () => {
    if (!search) {
      return toast({
        title: "Please enter name or email to search",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setIsChatLoading(true);
    axios
      .get(`/user/users`, {
        params: {
          search,
        },
      })
      .then((resp) => {
        setSearchResult(resp.data);
        setIsChatLoading(false);
      })
      .catch((err) => {
        console.log("Sidebar.js handleSearch() error=", err);
        toast({
          title: err?.message || "Something went wrong!",
          // description: "",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setIsChatLoading(false);
      });
  };

  const accessUserChat = (userId) => {
    setIsLoading(true);
    axios
      .post("/chats", {
        userId,
      })
      .then((resp) => {
        if (!chats.find((event) => event._id !== resp.data._id))
          setChats([resp.data.data, ...chats]);
        setSelectedChat(resp.data.data);
        setIsLoading(false);
        onClose();
      })
      .catch((err) => {
        console.log("Sidebar.js accessUserChat Error=", err);
        setIsLoading(false);
      });
  };

  const handleNotificationClick = (notif) => {
    setSelectedChat(notif.chat);
    const newNotifications = notifications.filter((item) => item !== notif);

    setNotifications(newNotifications);
  };

  if (!user) return;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa fa-search" aria-hidden="true"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talky
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon
                color={notifications.length ? "red" : "gray.400"}
                fontSize="2xl"
                m={1}
              />
            </MenuButton>
            <MenuList pl={2}>
              {notifications.length
                ? notifications.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      {notif.chat?.isGroupChat
                        ? `New message in ${notif.chat.chatName}`
                        : `New message from ${getSender(
                            notif.chat.users,
                            user
                          )}`}
                    </MenuItem>
                  ))
                : "No new messages"}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb="2">
              <Input
                placeholder="Search users by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {isChatLoading ? (
              <ChatLoading />
            ) : (
              searchResult.map((data) => (
                <UserListItem
                  key={data._id + ""}
                  userData={data}
                  onClick={() => accessUserChat(data._id)}
                />
              ))
            )}
          </DrawerBody>
          {isLoading && <Spinner ml="auto" display="flex" />}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
