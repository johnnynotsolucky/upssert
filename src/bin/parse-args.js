import { curry } from 'ramda'
import {
  globByPattern,
  mapFiles,
  patternsFromArgs
} from '../lib/util/globber'

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
  const globber = mapFiles(globByAbsolutePattern)
  return {
    ...paramsFromArgs(args),
    files: globber(patternsFromArgs(args._, defaultPattern))
  }
})
