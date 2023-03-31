import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiConfig, createClient } from "wagmi";
import { configureChains } from "@wagmi/core";
import { polygonMumbai } from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public";

const { provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider: provider,
  webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <WagmiConfig client={client}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </WagmiConfig>
);
