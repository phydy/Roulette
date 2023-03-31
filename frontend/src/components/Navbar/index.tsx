import { Button, Flex } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

export const getEllipsisTxt = (str: string, n = 6) => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
  }
  return "";
};

const Navbar = () => {
  const { address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  return (
    <Flex bgColor={"black"} py={5} px={5} justifyContent={"flex-end"}>
      <Button
        onClick={() => {
          if (address) {
            disconnect();
          } else {
            connect();
          }
        }}
      >
        {address ? getEllipsisTxt(address, 6) : "Connect Wallet"}
      </Button>
    </Flex>
  );
};

export default Navbar;
