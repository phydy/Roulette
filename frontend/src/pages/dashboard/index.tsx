import {
  Box,
  Text,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  Th,
} from "@chakra-ui/react";
import React from "react";
import { useProvider } from "wagmi";
import { useFetchPossibleWinnings } from "../../utils/hooks/useFetchPossibleWinnings";

const Dashboard = () => {
  const { possibleWinArray, currentSpin, loading } = useFetchPossibleWinnings();
  return (
    <Box minH='100vh' bgColor={"black"}>
      <Text
        textAlign={"center"}
        color='white'
        fontSize={"24px"}
        fontWeight='bold'
      >
        Current Spin - {currentSpin}
      </Text>

      <Flex color='white' mt={10} justifyContent={"center"}>
        <TableContainer h='500px' overflowY={"scroll"} w={"500px"}>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Number</Th>

                <Th isNumeric>Possible win on current spin</Th>
              </Tr>
            </Thead>

            {loading ? (
              <Text ml={48} mt={10} textAlign={"center"}>
                Loading...
              </Text>
            ) : (
              <Tbody>
                {possibleWinArray?.map((item, key) => (
                  <Tr>
                    <Td>{item.number}</Td>

                    <Td isNumeric>
                      {parseFloat(item.possibleWin).toFixed(2)} STT
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  );
};

export default Dashboard;
