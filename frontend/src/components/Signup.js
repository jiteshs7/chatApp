import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Image,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";

import axios from "../api/Api";
import useValidator from "../hooks/useValidator";
import { SECRET_USERINFO_KEY } from "../utility/constants";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const {
    value: name,
    isValid: isNameValid,
    errorMsg: nameErrorMsg,
    isValidated: isNameValidated,
    onChange: onNameChange,
    onBlur: onNameBlur,
  } = useValidator("", { isRequired: true, type: "string", name: "Name" });

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

  const {
    value: cPassword,
    isValid: isCPasswordValid,
    errorMsg: cPasswordErrorMsg,
    isValidated: isCPasswordValidated,
    onChange: onCPasswordChange,
    onBlur: onCPasswordBlur,
  } = useValidator("", {
    isRequired: true,
    type: "cPassword",
    length: {
      min: 6,
    },
    name: "Confirm Password",
    equalizer: password,
  });

  const [pic, setPic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isCPassVisible, setIsCPassVisible] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = (pic) => {
    if (!pic) {
      toast({
        title: "Please select an image",
        // description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setIsLoading(true);
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      // fetch("http://localhost:8080/upload-image", {
      //   method: "POST",
      //   body: formData,
      // })
      //   .then((resp) => resp.json())

      const formData = new FormData();

      formData.append("image", pic);

      // axios
      //   .post(
      //     "/upload-image",
      //     formData
      //     //   {
      //     // headers: {
      //     // 'Content-Type': 'multipart/form-data'
      //     // }
      //     // }
      //   )
      fetch("http://localhost:8080/upload-image", {
        method: "POST",
        body: formData,
      })
        .then((resp) => resp.json())
        .then((formData) => {
          setPic("http://localhost:8080/" + formData?.filePath);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Signup.js postDetails() Error=", err);
          toast({
            title: "Error",
            description:
              err?.response?.data?.message || "Something went wrong!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setIsLoading(false);
        });
    }
  };

  const submitHandler = (event) => {
    const isDataValid =
      isNameValidated() &&
      isEmailValidated() &&
      isPasswordValidated() &&
      isCPasswordValidated();
    if (!isDataValid) {
      return;
    }

    let obj = {
      email: email.trim(),
      password: password,
      name,
    };

    if (pic) {
      obj = {
        ...obj,
        profilePic: pic,
      };
    }

    setIsLoading(true);
    axios
      .post("/user/signup", obj)
      .then((resp) => {
        localStorage.setItem(
          SECRET_USERINFO_KEY,
          JSON.stringify(resp.data.data)
        );
        toast({
          title: "Registeration successfull!",
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
        setIsLoading(false);
      });
  };

  return (
    <VStack spacing="5px">
      <FormControl isInvalid={!isNameValid} id="signup-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          placeholder="Enter your name"
          onChange={onNameChange}
          onBlur={() => onNameBlur()}
          style={{ borderColor: isNameValid ? "#000" : "red" }}
        />
        {!isNameValid && <FormErrorMessage>{nameErrorMsg}</FormErrorMessage>}
      </FormControl>
      <FormControl isInvalid={!isEmailValid} id="signup-email" isRequired>
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
      <FormControl isInvalid={!isPasswordValid} id="signup-pass" isRequired>
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
      <FormControl
        isInvalid={!isCPasswordValid}
        id="signup-confirm-pass"
        isRequired
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            value={cPassword}
            type={isCPassVisible ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={onCPasswordChange}
            onBlur={() => onCPasswordBlur()}
            style={{ borderColor: isCPasswordValid ? "#000" : "red" }}
          />
          <InputRightElement width="4.5rem">
            <Button onClick={() => setIsCPassVisible((prev) => !prev)}>
              {isCPassVisible ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {!isCPasswordValid && (
          <FormErrorMessage>{cPasswordErrorMsg}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl id="signup-pic" isRequired>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
        {pic && (
          <Image
            style={{ alignSelf: "center" }}
            src={pic}
            w="100px"
            h="100px"
          />
        )}
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        type="submit"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        disabled={isLoading}
        isLoading={isLoading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
