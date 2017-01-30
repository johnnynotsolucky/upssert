import 'colors'
import time from '../util/time'
import symbols from './symbols'
import events from '../../data/events.json'

class Console {
  constructor () {
    this.suiteCount = 0
    this.testCount = 0
    this.assertionCount = 0
    this.passes = 0
    this.fails = 0
    this.tests = 0
    this.bail = false
    this.failLog = []
    this.startTime = 0
  }

  setWriter (writer) {
    this.writer = writer
  }

  setEventEmitter (emitter) {
    this.bindHandlers(emitter)
  }

  bindHandlers (emitter) {
    emitter.on(events.SUITE_COUNT, this::this.handleCount)
    emitter.on(events.TEST_COUNT, this::this.handleTestCount)
    emitter.on(events.ASSERTION_COUNT, this::this.handleAssertCount)
    emitter.on(events.START, this::this.handleStart)
    emitter.on(events.SUITE_START, this::this.handleSuiteStart)
    emitter.on(events.SUITE_TEST_START, this::this.handleTestStart)
    emitter.on(events.SUITE_TEST_PASS, this::this.handleTestPass)
    emitter.on(events.SUITE_TEST_FAIL, this::this.handleTestFail)
    emitter.on(events.SUITE_FAIL, this::this.handleSuiteFail)
    emitter.on(events.END, this::this.handleEnd)
  }

  handleCount (count) {
    this.suiteCount += count
  }

  handleTestCount (count) {
    this.testCount += count
  }

  handleAssertCount (count) {
    this.assertionCount += count
  }

  handleStart () {
    this.startTime = Date.now()
    this.runIfNotBailed(() => {
      let title = `\n  Executing ${this.suiteCount} test suites`
      title = `${title} (${this.assertionCount} assertions)${symbols.ellipsis}`
      this.writer.out(title.grey)
    })
  }

  handleSuiteStart (suite) {
    this.runIfNotBailed(() => {
      this.writer.out(`\n  ${suite.name}`.white)
    })
  }

  handleTestStart () {
    this.tests += 1
  }

  handleTestPass (test) {
    this.passes += 1
    this.runIfNotBailed(() => {
      const out = `    ${symbols.ok.green} ${test.name.grey}`
      this.writer.out(out)
    })
  }

  handleTestFail (test, err) {
    this.fails += 1
    this.runIfNotBailed(() => {
      this.failLog.push({ test, error: err })
      const out = `    ${symbols.error} ${test.name}`.red
      this.writer.out(out)
    })
  }

  handleSuiteFail (suite, err) {
    this.bail = true
    const out = [
      `${symbols.error} ${suite.name}`.red,
      err.message
    ]
    this.writer.lines(...out)
  }

  handleEnd () {
    this.runIfNotBailed(() => {
      const duration = time(Date.now() - this.startTime)

      this.failLog.forEach(({ test, error }, index) => {
        const errorOutput = [
          '',
          `  ${index + 1}) ${test.name.red}`,
          `  Error: ${error.message}`.white
        ]
        this.writer.lines(...errorOutput)
      })
      const out = [
        '',
        `  ${`${this.passes} passing`.green} ${`(${duration})`.grey}`,
        ''
      ]
      if (this.fails > 0) {
        out.splice(2, 0, `  ${this.fails} failing`.red)
      }
      this.writer.lines(...out)
    })
  }

  runIfNotBailed (fn) {
    if (!this.bail) {
      fn()
    }
  }
}

export default Console
