import { Box, Flex, Text } from "@chakra-ui/react";
import { useRef, useEffect } from "react";

const BottomBox = ({ range, pos }: { range: number; pos: string }) => {
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

  useEffect(() => {
    const handleBorderClick = (event: any) => {
      console.log("hovered");
      const { x, y } = borderRef.current.getBoundingClientRect();
      const clickX = event.clientX - x;
      const clickY = event.clientY - y;

      console.log(clickX, clickY);

      if (clickX <= 1 && clickY <= 1) {
        console.log("clicked");
        // Handle top-left corner click
      }
    };

    borderRef.current.addEventListener("click", handleBorderClick);

    // borderRef.current.addEventListener("mouseenter", handleBorderClick);
    // borderRef.current.addEventListener("mouseleave", handleBorderClick);

    return () => {
      borderRef.current.removeEventListener("click", handleBorderClick);

      //   borderRef.current.removeEventListener("mouseenter", handleBorderClick);
      //   borderRef.current.removeEventListener("mouseleave", handleBorderClick);
    };
  }, []);
  return (
    <Flex
      bgColor={"#32CD32"}
      justifyContent={"center"}
      alignItems='center'
      ref={borderRef}
      w='240px'
      h='60px'
      border='1px solid black'
    >
      <Flex
        justifyContent={"center"}
        alignItems='center'
        w='30px'
        h='30px'
        borderRadius={"50px"}
      >
        <Text
          color='white'
          fontWeight={"bold"}
          fontStyle={"18px"}
          textAlign={"center"}
          whiteSpace='nowrap'
        >
          {range}
          <span style={{ fontWeight: "lighter", fontSize: "14px" }}>
            {pos}{" "}
          </span>
          12
        </Text>
      </Flex>
    </Flex>
  );
};

export default BottomBox;
