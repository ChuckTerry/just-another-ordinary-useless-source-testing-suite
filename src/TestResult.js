import { Enum } from './Enum.js';

export class TestResult {
  #test;
  static outcomeEnum = new Enum('PASSED', 'FAILED', 'ERROR', 'INCOMPLETE');
  static clone(testResult) {
		if (testResult instanceof TestResult === false) {
			const object = {};
			object.getOutputString = () => '';
			return object;
		}
  	const object = {
  		func: testResult.func,
  		input: testResult.input,
  		expected: testResult.expected,
  		observed: testResult.observed,
  		passed: testResult.passed,
  		error: testResult.error,
  		outcome: testResult.outcome
  	};
  	object.getOutputString = TestResult.prototype.getOutputString.bind(object);
  	return object;
  }
  
  constructor(testObject) {
  	this.#test = testObject;
  	this.updateTestResult();
  }
  
  getTestResult() {
  	return this.outcome !== 3 && typeof this.passed === 'boolean' ? this.passed : false;
  }
  
  updateTestResult() {
  	this.func = this.#test.getFunction();
  	this.input = this.#test.getInput();
  	this.expected = this.#test.getExpected();
  	this.observed = this.#test.getObserved();
  	this.passed = this.observed === this.expected;
  	this.error = this.#test.getError();
  	if (this.#test.hasTestRun() === false) {
  		this.outcome = 3;
  	} else if (this.error instanceof Error) {
  		this.outcome = 2;
  	} else {
  		this.outcome = this.observed === this.expected ? 0 : 1;
  	}
  	return this;
  }
  
  getOutputString(tab = 0, verbose = false) {
  	const tabString = '\t'.repeat(tab);
  	const inputString = JSON.stringify(this.input);
  	const outcomeString = TestResult.outcomeEnum[this.outcome];
  	if (verbose === false) {
  		return `${tabString}${outcomeString}: ${this.func.name}(${inputString}) === ${this.expected}`;
  	}
  	const resultString = `${tabString}[${outcomeString}] Test ${this.func.name}(${inputString})\r\n${tabString}\tInput:${inputString}\r\n${tabString}\tExpected Output: ${this.expected}\r\n${tabString}\tObserved Output: ${this.observed}`
  	const errorString = this.error instanceof Error ? `\r\n${tabString}\tError: ${this.error.message}` : '';
  	return `${resultString}${errorString}\r\n`;
  }
}
	