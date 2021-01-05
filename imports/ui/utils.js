/* Function to format single digit number to two digit number. */
export const formatNumberTwoDigits = number => {
  // returning the number in format of en-US locale string with 2 minimum digits.
  return number.toLocaleString('en-US', { minimumIntegerDigits: 2 });
};
