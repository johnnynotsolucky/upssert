import { compose, curry } from 'ramda'
import glob from 'glob'
import { isDirectory } from './file-system'
import {
  either,
  joinStr,
  inverseJoinStr
} from './functional-utils'

// mapToPath :: String -> String -> String
const mapToAbsolutePath = curry((dir, p) =>
  !p.startsWith('/') ? joinStr('/', dir, p) : p)

// pathToPattern :: Object -> String -> String -> String
const directoryToPattern = curry((globOptions, postfix, p) =>
  isDirectory(p)
    .chain(either(p))
    .map(inverseJoinStr('/', postfix)))

// globFiles :: Object -> Either String -> [String]
const globFiles = curry((globOptions, m) => glob.sync(m.value, globOptions))

// byPattern :: String -> Object -> String -> [String]
const globByPattern = curry((dir, globOptions, postfix) =>
  compose(
    globFiles(globOptions),
    directoryToPattern(globOptions, postfix),
    mapToAbsolutePath(dir)
  ))

export {
  mapToAbsolutePath,
  directoryToPattern,
  globByPattern
}
