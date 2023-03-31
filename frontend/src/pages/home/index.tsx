import { Flex, Box, Text, Button, Input } from "@chakra-ui/react";
import NumberBox from "../../components/NumberBox";
import BottomBox from "../../components/NumberBox/BottomBox";
import BottomOptionBox from "../../components/NumberBox/BottomOptionBox";
import LeftExtraBox from "../../components/NumberBox/LeftExtraBox";
import RightExtraBox from "../../components/NumberBox/RightExtraBox";
import { useEffect, useState } from "react";
import NumberCircle from "../../components/NumberCircle";
import { Icon, SlideFade } from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import Navbar from "../../components/Navbar";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { erc20ABI } from "wagmi";
import roulleteabi from "../../utils/abis/roullette.json";
import {
  BLACK,
  COLUMNONE,
  COLUMNTHREE,
  COLUMNTWO,
  DOZENONE,
  DOZENTHREE,
  DOZENTWO,
  EVEN,
  HIGH,
  LOW,
  ODD,
  RED,
  ROULETTEADDRESS,
  STTADDRESS,
} from "../../utils/constant";
import { ethers } from "ethers";

export const blackBalls = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

function Home() {
  const [optionsToShow, setoptionsToShow] = useState<Array<Array<number>>>([]);

  const [hoveredNumbers, setHoveredNumbers] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [currentOption, setCurrentOption] = useState("");
  const { address } = useAccount();
  const [stakeInfo, setstakeInfo] =
    useState<Array<{ stakeAmount: number; option: number }>>();
  const [optionArrayForStraight, setoptionArrayForStraight] = useState<
    number[]
  >([]);

  const [amountArrayForStraight, setamountArrayForStraight] = useState<any[]>(
    []
  );

  const [totalStakeAmount, settotalStakeAmount] = useState(0);
  const [optionInput, setoptionInput] = useState<number[] | number>([]);
  const [formattedStakeAmount, setformattedStakeAmount] =
    useState<ethers.BigNumber>();
  const [roundEndTime, setroundEndTime] = useState("");

  const setInfo = (inputOption: number, stakeAmount: number) => {
    if (stakeInfo) {
      const newArray = [...stakeInfo];
      const findOption = newArray.filter(
        (option) => option.option === inputOption
      );

      if (findOption[0]) {
        const updatedArray = stakeInfo.map((obj) => {
          if (obj.option === findOption[0].option) {
            return { ...obj, stakeAmount: stakeAmount };
          }
          return obj;
        });

        setstakeInfo(updatedArray);
      } else {
        setstakeInfo((prev: any) => [
          ...prev,
          { stakeAmount, option: inputOption },
        ]);
      }
    } else {
      const info = [{ stakeAmount, option: inputOption }];
      setstakeInfo(info);
    }
  };

  useEffect(() => {
    const allOptions = [];
    const allAmounts = [];
    const formattedAmounts = [];

    if (stakeInfo) {
      for (let i = 0; i < stakeInfo.length; i++) {
        allOptions.push(stakeInfo[i].option);
        allAmounts.push(stakeInfo[i].stakeAmount);
        formattedAmounts.push(
          ethers.utils.parseEther(stakeInfo[i].stakeAmount.toString())
        );
      }
    }

    const totalAmount = allAmounts.reduce((part, a) => part + a, 0);
    settotalStakeAmount(totalAmount);
    setamountArrayForStraight(formattedAmounts);
    setoptionArrayForStraight(allOptions);
  }, [stakeInfo]);

  console.log("stakeInfo", stakeInfo);

  useEffect(() => {
    if (stakeAmount) {
      setformattedStakeAmount(ethers.utils.parseEther(stakeAmount));
    }
  }, [stakeAmount]);

  const { writeAsync: predictStraight } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeStaightUps",
    args: [optionArrayForStraight, amountArrayForStraight],
  });

  const { writeAsync: predictSplit } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeSplit",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictStreet } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeStreet",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictCorner } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeConer",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictSixLine } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeSixLine",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictColumn } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeColumn",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictDozen } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeDozone",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictNumber } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeNumberSide",
    args: [optionInput, formattedStakeAmount],
  });

  const { writeAsync: predictColor } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "placeColor",
    args: [optionInput, formattedStakeAmount],
  });

  const { data, isError, isLoading, refetch } = useContractRead({
    address: STTADDRESS,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, ROULETTEADDRESS],
  });

  const { data: currentRound } = useContractRead({
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "spinCount",
  });

  const { data: roundInfo } = useContractRead({
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "spinInfo",
    args: [currentRound?.toString()],
  });

  const { data: spinTime } = useContractRead({
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "MAX_SPIN_TIME",
  });

  console.log(currentRound, roundInfo, spinTime);

  const { writeAsync: approveToken } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: STTADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    args: [ROULETTEADDRESS, ethers.utils.parseEther("1000")],
  });

  // const { config: approveConfig } = usePrepareContractWrite({
  //   address: STTADDRESS,
  //   abi: erc20ABI,
  //   functionName: "approve",
  //   args: [
  //     ROULETTEADDRESS,
  //     ethers.utils.parseEther("100").toString(),
  //   ],
  // });

  useEffect(() => {
    refetch();
  }, [address]);

  useEffect(() => {
    const totalTime =
      parseFloat(roundInfo?.startTime.toString()) +
      parseFloat(spinTime?.toString());
    const date = new Date(totalTime * 1000);

    setroundEndTime(date.toLocaleString());
  }, [roundInfo, spinTime]);

  console.log(data);

  const approveTransaction = async () => {
    try {
      const tx = await approveToken();

      await tx.wait(2);

      refetch();

      window.alert("Approval Successful");
    } catch (err) {
      console.log(err);
    }
  };

  const confirmBet = async () => {
    if (currentOption === "Straight-up") {
      const tx = await predictStraight();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Split") {
      console.log(optionInput, formattedStakeAmount);
      const tx = await predictSplit();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Street") {
      const tx = await predictStreet();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Corner") {
      const tx = await predictCorner();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Six-Number") {
      const tx = await predictSixLine();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Column") {
      const tx = await predictColumn();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Dozen") {
      const tx = await predictDozen();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Low") {
      const tx = await predictNumber();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "High") {
      const tx = await predictNumber();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Red") {
      const tx = await predictColor();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Black") {
      const tx = await predictColor();

      await tx.wait(2);

      window.alert("Prediction Successful");
    } else if (currentOption === "Even") {
      //todo
    } else if (currentOption === "Odd") {
      //todo
    }
  };

  const { data: floatData } = useContractRead({
    address: ROULETTEADDRESS,
    abi: roulleteabi,
    functionName: "float",
  });

  useEffect(() => {
    const options = [...new Set(selectedNumbers)];

    if (currentOption === "Column") {
      if (options === COLUMNONE) {
        setoptionInput(1);
      } else if (options === COLUMNTWO) {
        setoptionInput(2);
      } else if (options === COLUMNTHREE) {
        setoptionInput(3);
      }
    } else if (currentOption === "Dozen") {
      if (options === DOZENONE) {
        setoptionInput(1);
      } else if (options === DOZENTWO) {
        setoptionInput(2);
      } else if (options === DOZENTHREE) {
        setoptionInput(3);
      }
    } else if (currentOption === "Low") {
      if (options === LOW) {
        setoptionInput(1);
      }
    } else if (currentOption === "High") {
      if (options === HIGH) {
        setoptionInput(2);
      }
    } else if (currentOption === "Red") {
      if (options === RED) {
        setoptionInput(2);
      }
    } else if (currentOption === "Black") {
      if (options === BLACK) {
        setoptionInput(1);
      }
    } else if (currentOption === "Even") {
      if (options === EVEN) {
        setoptionInput(1);
      }
    } else if (currentOption === "Odd") {
      if (options === ODD) {
        setoptionInput(2);
      }
    } else {
      setoptionInput(options);
    }
  }, [selectedNumbers, currentOption]);

  const plays = [
    {
      name: "Straight-up",
      possibleOptions: [
        [0],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
        [10],
        [11],
        [12],
        [13],
        [14],
        [15],
        [16],
        [17],
        [18],
        [19],
        [20],
        [21],
        [22],
        [23],
        [24],
        [25],
        [26],
        [27],
        [28],
        [29],
        [30],
        [31],
        [32],
        [33],
        [34],
        [35],
        [36],
      ],
    },
    {
      name: "Split",
      possibleOptions: [
        [1, 2],
        [2, 3],
        [4, 5],
        [5, 6],
        [7, 8],
        [8, 9],
        [10, 11],
        [11, 12],
        [13, 14],
        [14, 15],
        [16, 17],
        [17, 18],
        [19, 20],
        [20, 21],
        [22, 23],
        [23, 24],
        [25, 26],
        [26, 27],
        [28, 29],
        [29, 30],
        [31, 32],
        [32, 33],
        [34, 35],
        [35, 36],
      ],
    },
    {
      name: "Street",
      possibleOptions: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
        [13, 14, 15],
        [16, 17, 18],
        [19, 20, 21],
        [22, 23, 24],
        [25, 26, 27],
        [28, 29, 30],
        [31, 32, 33],
        [34, 35, 36],
      ],
    },
    {
      name: "Corner",
      possibleOptions: [
        [1, 2, 4, 5],
        [2, 3, 5, 6],
        [4, 5, 7, 8],
        [5, 6, 8, 9],
        [7, 8, 10, 11],
        [8, 9, 11, 12],
        [10, 11, 13, 14],
        [11, 12, 14, 15],
        [13, 14, 16, 17],
        [14, 15, 17, 18],
        [16, 17, 19, 20],
        [17, 18, 20, 21],
        [19, 20, 22, 23],
        [20, 21, 23, 24],
        [22, 23, 25, 26],
        [23, 24, 26, 27],
        [25, 26, 28, 29],
        [26, 27, 29, 30],
        [28, 29, 31, 32],
        [29, 30, 32, 33],
        [1, 32, 34, 35],
        [32, 33, 35, 36],
      ],
    },
    {
      name: "Six-Number",
      possibleOptions: [
        [1, 2, 3, 4, 5, 6],
        [4, 5, 6, 7, 8, 9],
        [7, 8, 9, 10, 11, 12],
        [10, 11, 12, 13, 14, 15],
        [13, 14, 15, 16, 17, 18],
        [16, 17, 18, 19, 20, 21],
        [19, 20, 21, 22, 23, 24],
        [22, 23, 24, 25, 26, 27],
        [25, 26, 27, 28, 29, 30],
        [28, 29, 30, 31, 32, 33],
        [31, 32, 33, 34, 35, 36],
      ],
    },
    {
      name: "Column",
      possibleOptions: [
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
      ],
    },
    {
      name: "Dozen",
      possibleOptions: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
      ],
    },
    {
      name: "Low",
      possibleOptions: [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      ],
    },
    {
      name: "High",
      possibleOptions: [
        [
          19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
          36,
        ],
      ],
    },
    {
      name: "Red",
      possibleOptions: [
        [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
      ],
    },
    {
      name: "Black",
      possibleOptions: [
        [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
      ],
    },
    // {
    //   name: "Even",
    //   possibleOptions: [
    //     [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    //   ],
    // },
    // {
    //   name: "Odd",
    //   possibleOptions: [
    //     [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    //   ],
    // },
  ];
  return (
    <Box bgColor={"black"}>
      <Flex
        pt={10}
        pb={10}
        flexDirection='column'
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Flex flexDirection='column'>
          <Flex flexDirection={"column"} justifyContent={"center"} mb={10}>
            {currentRound ? (
              <Text
                textAlign={"center"}
                color='white'
                fontSize={"24px"}
                fontWeight='bold'
              >
                Current Spin - {currentRound?.toString()}
              </Text>
            ) : null}

            {roundInfo ? (
              <Text
                textAlign={"center"}
                color='white'
                fontSize={"24px"}
                fontWeight='bold'
              >
                Spin End Time - {roundEndTime}
              </Text>
            ) : null}
          </Flex>
          <Flex>
            <LeftExtraBox cell='top' option={undefined} />
            {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map((number) => (
              <NumberBox
                number={number}
                selectedNumbers={selectedNumbers}
                hoveredNumbers={hoveredNumbers}
              />
            ))}

            <RightExtraBox />
          </Flex>
          <Flex>
            <LeftExtraBox cell='middle' option={0} />
            {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map((number) => (
              <NumberBox
                selectedNumbers={selectedNumbers}
                number={number}
                hoveredNumbers={hoveredNumbers}
              />
            ))}
            <RightExtraBox />
          </Flex>
          <Flex>
            <LeftExtraBox cell='bottom' option={undefined} />
            {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map((number) => (
              <NumberBox
                selectedNumbers={selectedNumbers}
                number={number}
                hoveredNumbers={hoveredNumbers}
              />
            ))}
            <RightExtraBox />
          </Flex>
          <Flex justifyContent={"center"}>
            <BottomBox range={1} pos={"st"} />
            <BottomBox range={2} pos={"nd"} />
            <BottomBox range={3} pos={"rd"} />
          </Flex>
          <Flex justifyContent={"center"}>
            <BottomOptionBox option='1 to 18' shape={false} />
            <BottomOptionBox option='EVEN' shape={false} />
            <BottomOptionBox option='red' shape={true} />
            <BottomOptionBox option='black' shape={true} />
            <BottomOptionBox option='ODD' shape={false} />
            <BottomOptionBox option='19 to 36' shape={false} />
          </Flex>
        </Flex>

        <Flex mt={10} flexDirection='column'>
          <Text
            textAlign={"center"}
            color='white'
            fontSize={"30px"}
            fontWeight='bold'
          >
            Choose an option
          </Text>

          <Flex mt={5}>
            <Flex>
              <Flex mr={2} flexDirection={"column"}>
                {plays.slice(0, 6).map((play) => (
                  <Button
                    onClick={() => {
                      setoptionsToShow(play?.possibleOptions);
                      setCurrentOption(play.name);
                    }}
                    mb={2}
                  >
                    {play.name}
                  </Button>
                ))}
              </Flex>
              <Flex flexDirection={"column"}>
                {plays.slice(6, 14).map((play) => (
                  <Button
                    onClick={() => {
                      setoptionsToShow(play?.possibleOptions);
                      setCurrentOption(play.name);
                    }}
                    mb={2}
                  >
                    {play.name}
                  </Button>
                ))}
              </Flex>

              {optionsToShow && optionsToShow?.length > 0 && (
                <Flex mt={40}>
                  <Icon boxSize={10} color='white' as={BsArrowRight} />
                </Flex>
              )}

              {optionsToShow && optionsToShow?.length > 0 && (
                <SlideFade in={true}>
                  <Flex
                    justifyContent={"center"}
                    pl={5}
                    pt={5}
                    bgColor={"white"}
                    maxW={"500px"}
                    flexWrap='wrap'
                    h='100%'
                  >
                    {optionsToShow
                      ? optionsToShow.map((options, i) => (
                          <NumberCircle
                            currentOption={currentOption}
                            setHoveredNumbers={setHoveredNumbers}
                            setSelectedNumbers={setSelectedNumbers}
                            options={options}
                          />
                        ))
                      : null}
                  </Flex>
                </SlideFade>
              )}
            </Flex>
          </Flex>
        </Flex>

        {selectedNumbers.length > 0 && (
          <Flex mt={5} flexDirection={"column"}>
            <Text
              textAlign={"center"}
              color='white'
              fontSize={"30px"}
              fontWeight='bold'
            >
              Input Stake Amount
            </Text>
            {currentOption === "Straight-up" ? (
              [...new Set(selectedNumbers)].map((number) => (
                <Flex alignItems={"center"}>
                  <Input
                    onChange={(e) =>
                      setInfo(number, parseFloat(e.target.value))
                    }
                    color='white'
                    my={2}
                  />{" "}
                  -{" "}
                  <Flex alignItems={"center"}>
                    <Text
                      mr={2}
                      color='white'
                      fontWeight={"bold"}
                      fontSize='14px'
                    >
                      {number}
                    </Text>
                    <Text
                      whiteSpace={"nowrap"}
                      color='white'
                      fontWeight={"bold"}
                      fontSize='14px'
                    >
                      Stake Amount
                    </Text>
                  </Flex>
                </Flex>
              ))
            ) : (
              <Flex alignItems={"center"}>
                <Input
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  color='white'
                  my={2}
                  mr={2}
                />{" "}
                <Flex alignItems={"center"}>
                  <Text
                    whiteSpace={"nowrap"}
                    color='white'
                    fontWeight={"bold"}
                    fontSize='14px'
                  >
                    Stake Amount
                  </Text>
                </Flex>
              </Flex>
            )}
            {currentOption === "Straight-up" && !totalStakeAmount ? (
              <Button>Enter stake amounts</Button>
            ) : currentOption === "Straight-up" &&
              totalStakeAmount &&
              parseFloat(ethers.utils.formatEther(data?.toString() as string)) <
                totalStakeAmount ? (
              <Button onClick={() => approveTransaction()}>
                Approve tokens
              </Button>
            ) : currentOption !== "Straight-up" && !stakeAmount ? (
              <Button onClick={() => confirmBet()}>Enter stake amount</Button>
            ) : currentOption !== "Straight-up" &&
              stakeAmount &&
              parseFloat(ethers.utils.formatEther(data?.toString() as string)) <
                parseFloat(stakeAmount) ? (
              <Button onClick={() => approveTransaction()}>
                Approve tokens
              </Button>
            ) : (
              <Button onClick={() => confirmBet()}>Confirm bet </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

export default Home;
