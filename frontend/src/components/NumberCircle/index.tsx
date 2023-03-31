import { Flex, Text } from "@chakra-ui/react";
import { blackBalls } from "../../App";
import React, { useRef, useEffect } from "react";

const NumberCircle = ({
  options,
  setHoveredNumbers,
  setSelectedNumbers,
  currentOption,
}: {
  options: number[];
  setHoveredNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  currentOption: string;
}) => {
  const optionRef = useRef<any>(null);

  //   useEffect(() => {
  //     const handleMouseEnter = (event: any) => {
  //         setHoveredNumbers()
  //     };

  //     const handleMouseLeave = () => {};

  //     // borderRef.current.addEventListener("mouseenter", handleBorderClick);
  //     // borderRef.current.addEventListener("mouseleave", handleBorderClick);

  //     return () => {
  //       //   borderRef.current.removeEventListener("mouseenter", handleBorderClick);
  //       //   borderRef.current.removeEventListener("mouseleave", handleBorderClick);
  //     };
  //   }, []);
  return (
    <>
      <Flex
        cursor={"pointer"}
        onMouseEnter={() => setHoveredNumbers(options)}
        onMouseLeave={() => setHoveredNumbers([])}
        onClick={() => {
          if (currentOption === "Straight-up") {
            setSelectedNumbers((prev) => [...prev, options[0]]);
          } else {
            setSelectedNumbers(options);
          }
        }}
        mr={4}
      >
        {options?.map((option) => (
          <Flex
            ref={optionRef}
            justifyContent={"center"}
            alignItems='center'
            w='30px'
            h='30px'
            borderRadius={"50px"}
            border={option === 0 ? "1px solid black" : "none"}
            bgColor={
              option === 0
                ? "none"
                : blackBalls.includes(option)
                ? "black"
                : "red"
            }
          >
            <Text
              color={option === 0 ? "black" : "white"}
              fontWeight={"bold"}
              fontStyle={"18px"}
              textAlign={"center"}
            >
              {option}
            </Text>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default NumberCircle;
