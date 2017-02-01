import R from 'ramda'
import {
  isDirectory,
  globByPattern,
  mapFiles,
  patternsFromArgs
} from './globber'

// paramsFromArgs :: a -> b
const paramsFromArgs = args => ({
  help: args.help || args.h,
  version: args.version,
  url: args.url,
  reporter: args.reporter || args.r || 'console'
})

// parseArgs :: Object -> Object -> Object -> Object
export default R.curry((args, { globOptions, defaultPattern }) => {
  const globByAbsolutePattern = globByPattern(isDirectory, process.cwd(), '**/*.json', globOptions)
  const globber = mapFiles(globByAbsolutePattern)
  return {
    ...paramsFromArgs(args),
    files: globber(patternsFromArgs(args._, defaultPattern))
  }
})
