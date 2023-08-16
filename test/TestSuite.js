import { TestSuite } from "../src/TestSuite";

const isPrime_InputExpectedArray = [
  [-1, false],
  [0, false],
  [1, false],
  [2, true],
  [3, true],
  [4, false],
  [5, true],
  [6, false],
  [7, true],
  [8, false],
  [9, false],
  [41823723279, false],
  [41823723281, true],
  [9361369, true],
  [115249, true]
];

function isPrime(number) {
  if (isNaN(number) || !isFinite(number) || number % 1 || number < 2) return false;
  if (number % 2 === 0) return (number === 2);
  if (number % 3 === 0) return (number === 3);
  const sqrt = Math.sqrt(number);
  for (let divisor = 5; divisor <= sqrt; divisor += 6) {
    if (number % divisor === 0) return false;
    if (number % (divisor + 2) === 0) return false;
  }
  return true;
}

const testSuite = new TestSuite(isPrime, testArray);
testSuite.runSuite(2, true);
