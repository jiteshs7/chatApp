import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import axios from "../api/Api";

import useValidator from "../hooks/useValidator";
import { SECRET_USERINFO_KEY } from "../utility/constants";

const Login = () => {
  const {
    value: email,
    isValid: isEmailValid,
    errorMsg: emailErrorMsg,
    isValidated: isEmailValidated,
    onChange: onEmailChange,
    onBlur: onEmailBlur,
  } = useValidator("", { isRequired: true, type: "email", name: "Email" });

  const {
    value: password,
    isValid: isPasswordValid,
    errorMsg: passwordErrorMsg,
    isValidated: isPasswordValidated,
    onChange: onPasswordChange,
    onBlur: onPasswordBlur,
  } = useValidator("", {
    isRequired: true,
    type: "string",
    length: {
      min: 6,
    },
    name: "Password",
  });

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const navigate = useNavigate();

  const submitHandler = () => {
    const isDataValid = isEmailValidated() && isPasswordValidated();

    if (!isDataValid) {
      return;
    }
    setIsLoading(true);

    axios
      .post("/user/login", {
        email,
        password,
      })
      .then((resp) => {
        localStorage.setItem(
          SECRET_USERINFO_KEY,
          JSON.stringify(resp.data.data)
        );
        toast({
          title: "Login successfull!",
          // description: "",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        navigate("/chats");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Login.js submitHandle() Error=", err);
        toast({
          title: "Error",
          description: err?.data?.message || "Something went wrong!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setIsLoading(false);
      });
  };

  const submitGuestHandler = () => {};

  return (
    <VStack spacing="5px">
      <FormControl isInvalid={!isEmailValid} id="login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={onEmailChange}
          onBlur={() => onEmailBlur()}
          style={{ borderColor: isEmailValid ? "#000" : "red" }}
        />
        {!isEmailValid && <FormErrorMessage>{emailErrorMsg}</FormErrorMessage>}
      </FormControl>

      <FormControl isInvalid={!isPasswordValid} id="login-pass" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={isPassVisible ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            onChange={onPasswordChange}
            onBlur={() => onPasswordBlur()}
            style={{ borderColor: isPasswordValid ? "#000" : "red" }}
          />
          <InputRightElement width="4.5rem">
            <Button onClick={() => setIsPassVisible((prev) => !prev)}>
              {isPassVisible ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {!isPasswordValid && (
          <FormErrorMessage>{passwordErrorMsg}</FormErrorMessage>
        )}
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        disabled={isLoading}
        isLoading={isLoading}
        onClick={submitHandler}
      >
        Login
      </Button>

      {/* <Button
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitGuestHandler}
      >
        Guest user credentials
      </Button> */}
    </VStack>
  );
};

export default Login;
