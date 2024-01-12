import React, { useState, useContext } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  FormControl,
  Spinner,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatContext } from "../../context/chatContext";
import axios from "../../api/Api";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { chats, setChats } = useContext(ChatContext);

  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleSearch = async (value) => {
    if (!value) return setSearchResult([]);
    setIsLoading(true);
    setSearch(value);

    axios
      .get(`/user/users`, {
        params: {
          search: value,
        },
      })
      .then((resp) => {
        setSearchResult(resp.data);
        setIsLoading(false);
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
        setIsLoading(false);
      });
  };

  const handleMemberAddittion = (userData) => {
    if (selectedUsers.includes(userData)) {
      return toast({
        title: "User already added.",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setSelectedUsers((prev) => [...prev, userData]);
  };

  const handleMemberRemove = (id) => {
    const users = [...selectedUsers];
    const requiredUsers = users.filter((e) => e._id !== id);

    setSelectedUsers(requiredUsers);
  };

  const handleSubmit = async () => {
    if (!chatName || !selectedUsers.length) {
      return toast({
        title: "Please fill all the fields.",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      const result = await axios.post("/chats/createGroup", {
        users: JSON.stringify(selectedUsers.map((user) => user._id)),
        name: chatName,
      });
      setChats([result?.data?.data, ...chats]);
      onClose();
      toast({
        title: "New group created!",
        // description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      console.log("GroupChat.js handleSubmit Error=", error);
      toast({
        title: error?.data?.message || "Something went wrong!",
        // description: "",
        status: "danger",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            style={{
              fontSize: "35px",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  onMemberClick={() => handleMemberRemove(user._id)}
                />
              ))}
            </Box>

            {isLoading ? (
              <Spinner ml="auto" display="flex" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((item) => (
                  <UserListItem
                    key={item._id}
                    userData={item}
                    onClick={() => handleMemberAddittion(item)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create chat
            </Button>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
