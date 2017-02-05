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

const argsToObject = () => minimist(process.argv.slice(2))

const cwd = process.cwd

// parseArgs :: Object -> Object -> Object -> Object
const parseArgs = ({ globOptions, pattern }) => {
  const args = argsToObject()
  const globByAbsolutePattern = globByPattern(cwd(), globOptions, '**/*.json')
  const globber = flatMap(globByAbsolutePattern)
  return {
    ...paramsFromArgs(args),
    files: globber(arrayOrDefault(args._, pattern))
  }
}

export {
  parseArgs
}
