import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SECRET_USERINFO_KEY } from "../utility/constants";

import Login from "../components/Login";
import Signup from "../components/Signup";
const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(SECRET_USERINFO_KEY);
    if (token) return navigate("/chats");
  }, []);

  return (
    <Container maxW="xl" centerContent={true}>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="#fff"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text
          textAlign="center"
          color="#000"
          fontFamily="Work sans"
          fontSize="4xl"
        >
          Talky
        </Text>
      </Box>

      <Box bg="#fff" w="100%" p={4} borderRadius="1g" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
