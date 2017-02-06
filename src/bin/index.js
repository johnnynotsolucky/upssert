#!/usr/bin/env node
/* eslint-disable no-console */
import 'babel-polyfill'
import { compose } from 'ramda'
import { Identity } from 'ramda-fantasy'
import { readJsonFile } from '../lib/util/json'
import { parseArgs } from './parse-args'
import { printMenu } from './menu'
import { getConfig } from '../lib/config'
import Upssert, { TapReporter, ConsoleReporter, LogWriter } from '../'
import pack from '../package.json' // eslint-disable-line import/no-unresolved

// state :: Object -> Object
const state = proc => {
  const conf = getConfig(proc)
  const args = parseArgs(proc, conf)
  return { args, conf }
}

// init :: Object -> IO a
const init = compose(Identity, state)

init(process)
  .chain(printMenu(pack))
  .runIO()

const config = getConfig(process)
const opts = parseArgs(process, config)

let data
if (opts.url) {
  data = opts.url
} else {
  data = []
  opts.files.forEach((file) => {
    const json = readJsonFile(file).value
    data.push(json)
  })
}

let reporter
switch (opts.reporter) {
  case 'tap':
    reporter = new TapReporter()
    break
  case 'console':
  default:
    reporter = new ConsoleReporter()
}
reporter.setWriter(new LogWriter())
const upssert = new Upssert({
  suites: data,
  reporter,
  config
})

const execute = async () => {
  const results = await upssert.execute()
  if (!results.pass) {
    process.exitCode = 1
  }
}
execute()
