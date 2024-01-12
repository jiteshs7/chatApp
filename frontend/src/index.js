import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import ChatCtxt from "./context/chatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <ChatCtxt>
          <App />
        </ChatCtxt>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
