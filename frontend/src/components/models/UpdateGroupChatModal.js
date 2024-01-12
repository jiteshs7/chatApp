import React, { useContext, useState } from "react";
import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatContext } from "../../context/chatContext";
import UserBadgeItem from "../user/UserBadgeItem";
import axios from "../../api/Api";
import UserListItem from "../user/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nameIsLoading, setNameIsLoading] = useState(false);

  const toast = useToast();

  const handleMemberRemove = async (userData) => {
    if (
      !selectedChat.users.find((e) => e._id !== userData._id) ||
      userData._id === user._id
    ) {
      return toast({
        title: "User already not in the group.",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (selectedChat.groupAdmin.find((e) => e !== user._id)) {
      return toast({
        title: "Only admin can add users to group.",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      const result = await axios.put("/chats/removeGroupUser", {
        chatId: selectedChat._id,
        userId: userData._id,
      });
      setSelectedChat(result.data.data);
      setFetchAgain((prev) => !prev);
      fetchMessages();
    } catch (error) {
      console.log("UpdateGroupChatModal handleAddUser() Error=", error);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    setNameIsLoading(true);
    try {
      const result = await axios.put("/chats/updateGroup", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
    
      setSelectedChat(result?.data?.data);
      setFetchAgain((prev) => !prev);
      setNameIsLoading(false);
      onClose();
    } catch (error) {
      console.log("UpdateGroupChatModal.js Error=", error);
      setNameIsLoading(false);
      onClose();
    }
    setGroupChatName("");
  };

  const handleSearch = (val) => {
    if (!val) {
      setSearchResult([]);
      setSearch(val);
      return;
      // return toast({
      //   title: "Please enter name or email to search",
      //   // description: "",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "top-left",
      // });
    }
    setIsLoading(true);
    axios
      .get(`/user/users`, {
        params: {
          search,
        },
      })
      .then((resp) => {
        setSearchResult(resp.data);
        setIsLoading(false);
        setSearch(val);
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

  const handleGroupLeaving = () => {};

  const handleAddUser = async (userData) => {
    if (selectedChat.users.find((e) => e._id === userData._id)) {
      return toast({
        title: "User already in the group.",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    if (selectedChat.groupAdmin.find((e) => e !== user._id)) {
      return toast({
        title: "Only admin can add users to group.",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      const result = await axios.put("/chats/addGroupUser", {
        chatId: selectedChat._id,
        userId: userData._id,
      });

      setSelectedChat(result.data.data);
    } catch (error) {
      console.log("UpdateGroupChatModal handleAddUser() Error=", error);
    }
  };

  return (
    <>
      <IconButton display="flex" icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {groupChatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexWrap="wrap">
            {selectedChat.users.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                onMemberClick={() => handleMemberRemove(user)}
              />
            ))}

            <FormControl display="flex">
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={isLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add user to group"
                mb={3}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {isLoading ? (
              <Spinner ml="auto" display="flex" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  userData={user}
                  onClick={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleGroupLeaving}>
              Leave Group
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
