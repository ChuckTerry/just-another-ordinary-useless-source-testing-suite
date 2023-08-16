import { TestResult } from "./TestResult";

export class Test {
  #input; #expected; #func; #result; #unique; #observed; #error; #testExecutionComplete;
  static identityFunction = (x) => x;
  constructor(input, expected, func = Test.identityFunction, spreadInput = false) {
    this.#observed = null;
    this.#spreadInput = spreadInput;
    this.#input = input;
    this.#expected = expected;
    this.#error = null;
    this.#func = func;
    this.#testExecutionComplete = false;
    this.#result = new TestResult(this);
    this.#unique = Symbol('unique');
  }
  
  updateFromTest(test) {
    if (test instanceof Test) {
      this.#input = test.getInput();
      this.#expected = test.getExpected();
      this.#func = test.getFunction();
      this.#resetTest();
      return this;
    }
    else {
      throw new Error('Test.updateFromTest(test) can only accept an argument of type Test');
    }
  }
  
  #resetTest() {
    this.#testExecutionComplete = false;
    this.#observed = null;
    this.#error = null;
    this.#result = new TestResult(this);
  }
  
  setInput(input) {
    this.#resetTest();
    this.#input = input;
  }
  
  setExpected(expected) {
    this.#resetTest();
    this.#expected = expected;
  }    
  
  setFunction(func) {
    if (typeof func !== 'function') throw new Error('Test.setFunction(func) can only accept an argument of type function');
    this.#resetTest();
    this.#func = func;
  }

  setSpreadInput(value) {
    this.#spreadInput = !!value;
    this.#resetTest();
  }
  
  getError() { return this.#error instanceof Error ? this.#error : undefined; }
  getExpected() { return this.#expected; }
  getFunction() { return this.#func; }
  getInput() { return this.#input; }
  getObserved() { return this.#observed; }
  getTestResult() { return this.#result; }
  
  hasError() { return this.#error instanceof Error; }
  hasTestRun() { return this.#testExecutionComplete; }

  run(verboseOutput) {
    this.#resetTest();
    let output = this.#unique;
    try {
      if (this.#spreadInput) {
        output = this.#func(...this.#input);
      } else {
        output = this.#func(this.#input);
      }
    } catch (error) {
      this.#error = error;
    }
    this.#observed = output === this.#unique ? null : output;
    this.#testExecutionComplete = true;
    const testObject = this.#result.updateTestResult();
    return testObject.getOutputString(0, verboseOutput);
  }
}
