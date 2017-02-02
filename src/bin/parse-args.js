import { curry } from 'ramda'
import { globByPattern } from '../lib/util/globber'
import {
  arrayOrDefault,
  toFlattenedArray
} from '../lib/util/functional-utils'

// paramsFromArgs :: a -> b
const paramsFromArgs = args => ({
  help: args.help || args.h,
  version: args.version,
  url: args.url,
  reporter: args.reporter || args.r || 'console'
})

// parseArgs :: Object -> Object -> Object -> Object
export default curry((args, { globOptions, defaultPattern }) => {
  const globByAbsolutePattern = globByPattern(process.cwd(), globOptions, '**/*.json')
  const globber = toFlattenedArray(globByAbsolutePattern)
  return {
    ...paramsFromArgs(args),
    files: globber(arrayOrDefault(args._, defaultPattern))
  }
})
