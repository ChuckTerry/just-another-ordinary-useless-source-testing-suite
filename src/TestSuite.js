import { Enum } from "./Enum";
import { Test } from "./Test";

export class TestSuite {
  #outputDetailLevel; #spreadInput;
  static enum_OutputDetailLevel = new Enum('NONE', 'SUMMARY', 'STANDARD', 'VERBOSE');
  static unique = Symbol('unique');

  static generateInputExpectedArrayFromTrueFalseArray(trueArray, falseArray = null) {
    if (falseArray === null) {
      if (trueArray.length === 2) {
        falseArray = trueArray[1];
        trueArray = trueArray[0];
      }
    }
    const trueTestCount = trueArray.length;
    const falseTestCount = falseArray.length;
    const highestCount = Math.max(trueTestCount, falseTestCount);
    const inputExpectedArray = [];
    for (let index = 0; index < highestCount; index++) {
      if (index < trueTestCount) inputExpectedArray.push([trueArray[index], true]);
      if (index < falseTestCount) inputExpectedArray.push([falseArray[index], false]);
    }
    return inputExpectedArray;
  }

  constructor(func, inputExpectedArray = [], spreadInput = false) {
    this.setOutputDetailLevel('STANDARD');
    this.#spreadInput = spreadInput;
    this.func = func;
    this.tests = [];
    this.passed = [];
    this.failed = [];
    this.addTests(inputExpectedArray);
  }

  setOutputDetailLevel(level) {
    let actualLevel = -1;
    if (typeof level === 'string') {
      const enumLookup = TestSuite.enum_OutputDetailLevel[level.toUpperCase()];
      if (typeof enumLookup === 'undefined') {
        throw new RangeError('TestSuite.setOutputDetailLevel(level) can only accept an argument of type string if that string is a member of TestSuite.enum_OutputDetailLevel');
      }
      actualLevel = enumLookup;
    } else if (typeof level === 'number') {
      if (TestSuite.enum_OutputDetailLevel[level] === undefined) {
        throw new RangeError('TestSuite.setOutputDetailLevel(level) recieved a value that is not a member of TestSuite.enum_OutputDetailLevel');
      }
      actualLevel = level;
    } else {
      throw new TypeError('TestSuite.setOutputDetailLevel(level) can only accept an argument of type string or number');
    }
    this.#outputDetailLevel = actualLevel;
  }

  resetPassedFailed() {
    this.passed = [];
    this.failed = [];
  }

  findTest(input, expected = TestSuite.unique) {
    const testCount = this.tests.length;
    const inputOnly = expected === TestSuite.unique;
    for (let index = 0; index < testCount; index++) {
      const test = this.tests[index];
      if (test.getInput() === input && test.getExpected() === expected) {
        if (inputOnly) {
          return test;
        } else {
          if (test.getExpected() === expected) return test;
        }
      }
    }
    return null;
  }

  addTests(inputExpectedArray) {
    const testCount = inputExpectedArray.length;
    for (let index = 0; index < testCount; index++) {
      const input = inputExpectedArray[index][0];
      const expected = inputExpectedArray[index][1];
      const existing = this.findTest(input);
      if (existing !== null) {
        existing.setExpected(expected);
        this.resetPassedFailed();
      } else {
        this.addTestWithInputExpected(input, expected);
      }
    }
  }

  addTest(test) {
    this.resetPassedFailed();
    if (test instanceof Test) {
      const existing = this.findTest(test.getInput());
      if (existing !== null) {
        existing.updateFromTest(test);
        return existing;
      }
      this.tests.push(test);
      return test;
    } else {
      throw new Error('TestSuite.addTest(test) can only accept an argument of type Test');
    }
  }

  addTestWithInputExpected(input, expected) {
    const test = new Test(input, expected, this.func, this.#spreadInput);
    return this.addTest(test);
  }

  runSuite(outputDetailLevel = this.#outputDetailLevel, verboseOutput = false) {
    const testCount = this.tests.length;
    const results = [];
    for (let index = 0; index < testCount; index++) {
      const test = this.tests[index];
      results.push(test.run(verboseOutput));
      if (test.getTestResult()) {
        this.passed.push(test);
      } else {
        this.failed.push(test);
      }
    }
    console.log(results.join('\r\n'));
  }                            

}
