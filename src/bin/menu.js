import { curry, compose, chain, path } from 'ramda'
import {
  inverseMaybeEither,
  bimap,
  fold,
  emptyIO,
  exit,
  log,
  booleanMaybe
} from '../lib/util/functional-utils'

// helpText :: String -> Maybe String
const helpText = s => {
  const text = `
  ${s}

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
  return booleanMaybe(text)
}

// versionText :: String -> Maybe String
const versionText = s => booleanMaybe(s)

// helpOption :: Object
const helpOption = path(['args', 'help'])

// helpOutput :: Object -> String -> Object -> Maybe String
const helpOutput = (args, description) =>
  compose(inverseMaybeEither(args), helpText(description), helpOption)

// versionOption :: Object
const versionOption = path(['args', 'version'])

// versionOutput :: Object -> String -> Object -> Maybe String
const versionOutput = (args, version) =>
  compose(inverseMaybeEither(args), versionText(version), versionOption)

// logAndExit :: a -> IO a
const logAndExit = compose(chain(exit(0)), log)

// printMenu :: Object -> IO
const printMenu = curry(({ description, version }, args) => {
  const f = compose(
    fold,
    bimap(logAndExit, emptyIO),
    chain(helpOutput(args, description)),
    versionOutput(args, version)
  )
  return f(args)
})

export {
  printMenu
}
