// import { EventEmitter } from 'events';
// import TestExecutor from './test';
// import events from '../../data/events.json';

// class Suite extends EventEmitter {
//   constructor(testCase) {
//     super();
//     this.bindEmitters();
//     this.testCase = testCase;
//     this.testExecutors = [];
//   }

//   bindEmitters() {
//     this.testStart = this.testStart.bind(this);
//     this.testEnd = this.testEnd.bind(this);
//     this.testPass = this.testPass.bind(this);
//     this.testFail = this.testFail.bind(this);
//     this.assertionCount = this.assertionCount.bind(this);
//   }

//   async execute() {
//     this.emit(events.SUITE_START, this.testCase);
//     await this.executeTestsInOrder();
//     this.emit(events.SUITE_END, this.testCase);
//   }

//   initialize() {
//     tv4.addSchema('formdata-schema', formdataSchema);
//     tv4.addSchema('request-schema', requestSchema);
//     tv4.addSchema('test-schema', testSchema);
//     const testValid = tv4.validate(this.testCase, suiteSchema);
//     if (testValid) {
//       this.emit(events.SUITE_COUNT, 1);
//       this.initializeTests();
//     } else {
//       this.emit(events.SUITE_FAIL, this.testCase, tv4.error);
//     }
//   }

//   initializeTests() {
//     let i = 1;
//     for (const test of this.testCase.tests) {
//       if (!test.id) {
//         test.id = `test${i}`;
//         i += 1;
//       }
//       const executor = new TestExecutor(test);
//       executor.on(events.SUITE_TEST_START, this.testStart);
//       executor.on(events.SUITE_TEST_END, this.testEnd);
//       executor.on(events.SUITE_TEST_PASS, this.testPass);
//       executor.on(events.SUITE_TEST_FAIL, this.testFail);
//       executor.on(events.SUITE_ASSERTION_COUNT, this.assertionCount);
//       executor.initialize();
//       this.testExecutors.push(executor);
//     }
//     this.emit(events.SUITE_TEST_COUNT, this.testCase.tests.length);
//   }

//   async executeTestsInOrder() {
//     const results = {};
//     for (const executor of this.testExecutors) {
//       const result = await executor.execute(results);
//       results[result.test.id] = result;
//     }
//   }

//   testStart(test) {
//     this.emit(events.SUITE_TEST_START, test);
//   }

//   testEnd(test) {
//     this.emit(events.SUITE_TEST_END, test);
//   }

//   testPass(test) {
//     this.emit(events.SUITE_TEST_PASS, test);
//   }

//   testFail(test, err) {
//     this.emit(events.SUITE_TEST_FAIL, test, err);
//   }

//   assertionCount(count) {
//     this.emit(events.SUITE_ASSERTION_COUNT, count);
//   }
// }

// export default Suite;
"use strict";