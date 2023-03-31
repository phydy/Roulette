export const getPay = (selectedOption: string) => {
  if (selectedOption === "Straight-up") {
    return 35;
  } else if (selectedOption === "Split") {
    return 17;
  } else if (selectedOption === "Street") {
    return 11;
  } else if (selectedOption === "Corner") {
    return 8;
  } else if (selectedOption === "Six-Number") {
    return 5;
  } else if (selectedOption === "Column") {
    return 2;
  } else if (selectedOption === "Dozen") {
    return 2;
  } else if (selectedOption === "Low") {
    return 1;
  } else if (selectedOption === "High") {
    return 1;
  } else if (selectedOption === "Red") {
    return 1;
  } else if (selectedOption === "Black") {
    return 1;
  } else if (selectedOption === "Even") {
    return 1;
  } else if (selectedOption === "Odd") {
    return 1;
  }
};
