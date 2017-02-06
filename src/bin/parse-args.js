import minimist from 'minimist'
import { globByPattern } from '../lib/util/globber'
import {
  arrayOrDefault,
  flatMap
} from '../lib/util/functional-utils'

// paramsFromArgs :: a -> b
const paramsFromArgs = args => ({
  help: args.help || args.h,
  version: args.version,
  url: args.url,
  reporter: args.reporter || args.r || 'console'
})

const argsToObject = proc => minimist(proc.argv.slice(2))

const cwd = proc => proc.cwd()

// parseArgs :: Object -> Object -> Object -> Object
const parseArgs = (proc, { globOptions, pattern }) => {
  const args = argsToObject(proc)
  const globByAbsolutePattern = globByPattern(cwd(proc), globOptions, '**/*.json')
  const globber = flatMap(globByAbsolutePattern)
  return {
    ...paramsFromArgs(args),
    files: globber(arrayOrDefault(args._, pattern))
  }
}

export {
  parseArgs
}
