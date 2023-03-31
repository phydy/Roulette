import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef, useEffect } from "react";

const LeftExtraBox = ({
  option,
  cell,
}: {
  option: number | undefined;
  cell: string;
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

  //   useEffect(() => {
  //     const handleBorderClick = (event: any) => {
  //       console.log("hovered");
  //       const { x, y } = borderRef.current.getBoundingClientRect();
  //       const clickX = event.clientX - x;
  //       const clickY = event.clientY - y;

  //       console.log(clickX, clickY);

  //       if (clickX <= 1 && clickY <= 1) {
  //         console.log("clicked");
  //         // Handle top-left corner click
  //       }
  //     };

  //     borderRef.current.addEventListener("click", handleBorderClick);

  //     // borderRef.current.addEventListener("mouseenter", handleBorderClick);
  //     // borderRef.current.addEventListener("mouseleave", handleBorderClick);

  //     return () => {
  //       borderRef.current.removeEventListener("click", handleBorderClick);

  //       //   borderRef.current.removeEventListener("mouseenter", handleBorderClick);
  //       //   borderRef.current.removeEventListener("mouseleave", handleBorderClick);
  //     };
  //   }, []);
  return (
    <Flex
      bgColor={"#32CD32"}
      justifyContent={"center"}
      alignItems='center'
      ref={borderRef}
      w='60px'
      h='60px'
      border='1px solid black'
      borderTop={cell === "middle" || cell === "bottom" ? "none" : ""}
      borderBottom={cell === "middle" || cell === "top" ? "none" : ""}
    >
      {option !== undefined ? (
        <Flex
          justifyContent={"center"}
          alignItems='center'
          w='30px'
          h='30px'
          borderRadius={"50px"}
          border='2px solid white'
        >
          <Text
            color='white'
            fontWeight={"bold"}
            fontStyle={"18px"}
            transform={"rotate(270deg)"}
            textAlign={"center"}
          >
            {option}
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
};

export default LeftExtraBox;
