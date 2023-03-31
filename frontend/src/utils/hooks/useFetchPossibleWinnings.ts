import { useContract, useAccount, useProvider } from "wagmi";
import { ROULETTEADDRESS } from "../constant";
import { useEffect, useMemo, useState } from "react";
import rouletteabi from "../abis/roullette.json";
import { ethers } from "ethers";

export const useFetchPossibleWinnings = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const provider = useProvider();
  const roulletteContract = useContract({
    address: ROULETTEADDRESS,
    abi: rouletteabi,
    signerOrProvider: provider,
  });
  const [possibleWinArray, setpossibleWinArray] = useState<
    Array<{ number: number; possibleWin: string }>
  >([]);
  const [currentSpin, setcurrentSpin] = useState("");

  console.log(roulletteContract);

  const numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  ];

  useMemo(async () => {
    try {
      setLoading(true);
      if (address && roulletteContract) {
        const winnings = [];
        const spin = await roulletteContract?.spinCount();
        setcurrentSpin(spin.toString());
        for (let i = 0; i < numbers.length; i++) {
          const possibleWin = await roulletteContract?.numberAddressAmount(
            numbers[i],
            spin.toString(),
            address
          );

          winnings.push({
            number: numbers[i],
            possibleWin: ethers.utils.formatEther(possibleWin?.toString()),
          });
        }
        setpossibleWinArray(winnings);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [address, roulletteContract]);
  return { possibleWinArray, currentSpin, loading };
};
