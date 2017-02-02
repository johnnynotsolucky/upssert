import { compose, curry } from 'ramda'
import { Identity } from 'ramda-fantasy'
import glob from 'glob'
import { isDirectory } from './file-system'
import {
  either,
  inverseEither,
  joinStr,
  inverseJoinStr
} from './functional-utils'

// mapToPath :: String -> String -> String
const mapToPath = curry((dir, p) =>
  !p.startsWith('/') ? joinStr('/', dir, p) : p)

// isGlobPattern :: Object -> String -> Identity Boolean
const isGlobPattern = curry((globOptions, p) =>
  Identity(glob.hasMagic(p, globOptions)))

// pathToPattern :: Object -> String -> String -> String
const pathToPattern = curry((globOptions, postfix, p) =>
  isGlobPattern(globOptions, p)
    .chain(inverseEither(p))
    .chain(isDirectory)
    .chain(either(p))
    .map(inverseJoinStr('/', postfix)))

// globFiles :: Object -> Either String -> [String]
const globFiles = curry((globOptions, p) => glob.sync(p.value, globOptions))

// byPattern :: String -> Object -> String -> [String]
const globByPattern = curry((dir, globOptions, postfix) =>
  compose(
    globFiles(globOptions),
    pathToPattern(globOptions, postfix),
    mapToPath(dir)
  ))

export {
  mapToPath,
  pathToPattern,
  globByPattern
}
