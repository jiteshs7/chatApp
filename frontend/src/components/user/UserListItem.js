import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ userData, onClick }) => {
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        backgroundColor: "#3882AC",
        color: "#fff",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      borderRadius="1g"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={userData.name}
        src={userData.profilePic}
      />
      <Box>
        <Text>{userData.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {userData.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
