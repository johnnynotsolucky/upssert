import { compose, curry, map, flatten } from 'ramda'
import glob from 'glob'
import { isDirectory } from './file-system'

// mapToPath :: String -> String -> String
const mapToPath = curry((baseDir, p) =>
  !p.startsWith('/') ? `${baseDir}/${p}` : p)

// pathToPattern :: Object -> String -> String -> String
const pathToPattern = curry((globOptions, postfix, p) =>
  !glob.hasMagic(p, globOptions)
    ? (isDirectory(p) ? [p, postfix].join('/') : p)
    : p)

// globFiles :: Object -> String -> [String]
const globFiles = curry((globOptions, p) => glob.sync(p, globOptions))

// byPattern :: String -> Object -> String -> [String]
const globByPattern = curry((dir, globOptions, postfix) =>
  compose(
    globFiles(globOptions),
    pathToPattern(globOptions, postfix),
    mapToPath(dir)
  ))

// mapFiles :: (String -> [String]) -> [String]
const mapFiles = f => (patterns) => {
  const patternsToFiles = compose(flatten, map(f))
  return patternsToFiles(patterns)
}

// patternsFromArgs :: [String] -> String -> [String]
const patternsFromArgs = curry((args, defaultDir) => args.length ? args : [defaultDir])

export {
  mapToPath,
  isDirectory,
  pathToPattern,
  globFiles,
  globByPattern,
  mapFiles,
  patternsFromArgs
}
