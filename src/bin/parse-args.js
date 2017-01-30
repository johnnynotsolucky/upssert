import glob from 'glob'
import fs from 'fs'
import R from 'ramda'

// paramsFromArgs :: String -> a -> b
const paramsFromArgs = reporter => argv => ({
  help: argv.help || argv.h,
  version: argv.version,
  url: argv.url,
  reporter: argv.reporter || argv.r || 'console'
})

// mapToPath :: String -> String -> String
const mapToPath = baseDir => p =>
  !p.startsWith('/') ? `${baseDir}/${p}` : p

// pathToPattern :: Object -> String -> String
const pathToPattern = globOptions => p =>
  !glob.hasMagic(p, globOptions)
    ? (fs.statSync(p).isDirectory() ? `${p}/**/*.json` : p) : p

// globFiles :: Object -> String -> [String]
const globFiles = globOptions => p => glob.sync(p, globOptions)

// byPattern :: String, Object -> String -> [String]
const byPattern = (cwd, globOptions) =>
  R.compose(
    globFiles(globOptions),
    pathToPattern(globOptions),
    mapToPath(cwd)
  )

// mapFiles :: (String -> [String]) -> [String]
const mapFiles = f => (patterns) => {
  const reducer = (acc, val) => R.concat(acc, f(val))
  const patternsToFiles = R.reduce(reducer, [])
  return patternsToFiles(patterns)
}

// patternsFromArgs :: [String], String -> [String]
const patternsFromArgs = (args, fallback) => args.length ? args : [fallback]

export default (argv, config) => {
  const byAbsolutePattern = byPattern(process.cwd(), config.globOptions)
  const globber = mapFiles(byAbsolutePattern)
  return {
    ...paramsFromArgs(argv),
    files: globber(patternsFromArgs(argv._, config.testDir))
  }
}
