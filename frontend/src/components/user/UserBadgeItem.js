import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, onMemberClick }) => {
  return (
    <Box
      display="inline-flex"
      px={2}
      py={1}
      borderRadius="1g"
      m={1}
      mb={2}
      fontSize={12}
      bgColor="purple"
      color="#fff"
      cursor="ponter"
      onClick={onMemberClick}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
