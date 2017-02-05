#!/usr/bin/env node
/* eslint-disable no-console */
import 'babel-polyfill'
import { compose, chain, prop, identity } from 'ramda'
import { Maybe } from 'ramda-fantasy'
import { inverseMaybeEither, bimap } from '../lib/util/functional-utils'
import { readJsonFile } from '../lib/util/json'
import { parseArgs } from './parse-args'
import pack from '../package.json' // eslint-disable-line import/no-unresolved
import { getConfig } from '../lib/config'
import Upssert, { TapReporter, ConsoleReporter, LogWriter } from '../'

const config = getConfig()
const opts = parseArgs(config)

const helpText = p =>
  `
  ${p.description}

  Usage: upssert [options...] [glob]

  Default glob searches in tests/api/**/*.js

  upssert -r tap --url https://httpbin.org/get
  upssert tests/api/**/*.json

  options:
    --url           Ping supplied URL
    --reporter, -r  Set test reporter (tap, console)
    --help,     -h  Show help
    --version
  `

const versionText = p => p.version

const state = conf => ({
  args: parseArgs(conf),
  conf
})

const setup = compose(state, getConfig)

const showHelp = x => x ? Maybe(helpText(pack)) : Maybe.Nothing()

const showVersion = x => x ? Maybe(versionText(pack)) : Maybe.Nothing()

const print = x => {
  console.log(x)
  return x
}

const exit = code => () => process.exit(code)

const printOutput = args => {
  const f = compose(
    bimap(exit(0), identity),
    bimap(print, identity),
    chain(compose(inverseMaybeEither(args), showVersion, prop('version'))),
    compose(inverseMaybeEither(args), showHelp, prop('help'))
  )
  f(args)
}

printOutput(setup().args)

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
