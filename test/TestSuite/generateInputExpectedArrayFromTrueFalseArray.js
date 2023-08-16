import { TestSuite } from "../../src/TestSuite";
import { compareEntryArrays } from "../util/compareEntryArrays.js";

const control_InputExpectedArray = [
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

const raw_TrueFalseArray = [
  [2, 3, 5, 7, 41823723281, 9361369, 115249],
  [-1, 0, 1, 4, 6, 8, 9, 41823723279]
];

const test_TrueFalseArray_Standard = TestSuite.generateInputExpectedArrayFromTrueFalseArray(raw_TrueFalseArray[0], raw_TrueFalseArray[1]);
const test_TrueFalseArray_CombinedSingleArgument = TestSuite.generateInputExpectedArrayFromTrueFalseArray(raw_TrueFalseArray);

const inputExpectedArray = [
  [[control_InputExpectedArray, test_TrueFalseArray_Standard], true],
  [[control_InputExpectedArray, test_TrueFalseArray_CombinedSingleArgument], true]
];

export const localTestSuite = new TestSuite(compareEntryArrays, inputExpectedArray, true);
