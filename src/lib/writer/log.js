/* eslint-disable no-console,class-methods-use-this */
export default class LogWriter {
  out (...args) {
    console.log(...args)
  }

  lines (...args) {
    for (const line of args) {
      console.log(line)
    }
  }
}
