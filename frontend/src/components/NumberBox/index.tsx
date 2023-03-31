import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { blackBalls } from "../../App";

const NumberBox = ({
  number,
  color,
  hoveredNumbers,
  selectedNumbers,
}: {
  number: number;
  color?: string;
  hoveredNumbers: number[];
  selectedNumbers: number[];
}) => {
  const borderRef = useRef<any>(null);

  //   useEffect(() => {
  //     const handleBorderClick = (event: any) => {
  //       const { x, y, width } = borderRef.current.getBoundingClientRect();
  //       console.log(event.clientX, x);
  //       const clickX = event.clientX - x;

  //       if (clickX >= width - 3) {
  //         console.log("clicked");
  //         // Handle right border click
  //       }
  //     };

  //     borderRef.current.addEventListener("click", handleBorderClick);

  //     return () => {
  //       borderRef.current.removeEventListener("click", handleBorderClick);
  //     };
  //   }, []);

  const valid =
    hoveredNumbers.length > 0
      ? hoveredNumbers.includes(number)
        ? true
        : false
      : false;

  const stillValid =
    selectedNumbers.length > 0
      ? selectedNumbers.includes(number)
        ? true
        : false
      : false;
  return (
    <Flex
      position={"relative"}
      _before={
        valid || stillValid
          ? {
              content: '" "',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              zIndex: 1,
            }
          : {}
      }
      bgColor={"#32CD32"}
      justifyContent={"center"}
      alignItems='center'
      ref={borderRef}
      w='60px'
      h='60px'
      border='1px solid black'
    >
      <Flex
        justifyContent={"center"}
        alignItems='center'
        w='30px'
        h='30px'
        borderRadius={"50px"}
        bgColor={
          number === 0 ? "" : blackBalls.includes(number) ? "black" : "red"
        }
      >
        <Text
          color='white'
          fontWeight={"bold"}
          fontStyle={"18px"}
          transform={"rotate(270deg)"}
          textAlign={"center"}
        >
          {number}
        </Text>
      </Flex>
    </Flex>
  );
};

export default NumberBox;
