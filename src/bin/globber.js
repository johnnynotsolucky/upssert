import R from 'ramda'
import glob from 'glob'

// mapToPath :: String -> String -> String
const mapToPath = R.curry((baseDir, p) => !p.startsWith('/') ? `${baseDir}/${p}` : p)

// isDirectory :: Object -> String -> Boolean
const isDirectory = R.curry((fs, p) => fs.statSync(p).isDirectory())

// pathToPattern :: (Object -> String -> Boolean) -> Object -> String -> String -> String
const pathToPattern = R.curry((f, globOptions, postfix, p) =>
  !glob.hasMagic(p, globOptions) ? (f(p) ? `${p}${postfix}` : p) : p)

// globFiles :: Object -> String -> [String]
const globFiles = R.curry((globOptions, p) => glob.sync(p, globOptions))

// byPattern :: (Object -> String -> Boolean) -> String -> Object -> String -> [String]
const globByPattern = R.curry((f, cwd, globOptions, postfix) =>
  R.compose(
    globFiles(globOptions),
    pathToPattern(f, globOptions, postfix),
    mapToPath(cwd)
  ))

// mapFiles :: (String -> [String]) -> [String]
const mapFiles = f => (patterns) => {
  const patternsToFiles = R.compose(R.flatten, R.map(f))
  return patternsToFiles(patterns)
}

// patternsFromArgs :: [String] -> String -> [String]
const patternsFromArgs = R.curry((args, defaultDir) => args.length ? args : [defaultDir])

export {
  mapToPath,
  isDirectory,
  pathToPattern,
  globFiles,
  globByPattern,
  mapFiles,
  patternsFromArgs
}
