import glob from 'glob'
import fs from 'fs'
import R from 'ramda'

const defaultReporter = () => 'console'
const argvParams = reporter => argv => ({
  help: argv.help || argv.h,
  version: argv.version,
  url: argv.url,
  reporter: argv.reporter || argv.r || reporter
})
const argsWithReporter = argvParams(defaultReporter())

const relativePatternToAbsolutePattern = baseDir => p =>
  !p.startsWith('/') ? `${baseDir}/${p}` : p
const directoryPathToPattern = globOptions => (p) =>
  !glob.hasMagic(p, globOptions)
    ? (fs.statSync(p).isDirectory() ? `${p}/**/*.json` : p) : p
const globFilesForPattern = globOptions => p => glob.sync(p, globOptions)

const globFiles = cwd => globOptions => patterns => {
  const cwdPattern = relativePatternToAbsolutePattern(cwd)
  const dirPatternOpts = directoryPathToPattern(globOptions)
  const globWithOpts = globFilesForPattern(globOptions)
  const globByPattern = R.compose(globWithOpts, dirPatternOpts, cwdPattern)
  const reducer = (acc, val) => R.concat(acc, globByPattern(val))
  const patternsToFiles = R.reduce(reducer, [])
  return patternsToFiles(patterns)
}

const cwdGlob = globFiles(process.cwd())

export default (argv, config) => {
  const patterns = [...argv._]
  if (patterns.length === 0) {
    patterns.push(config.testDir)
  }

  const globWithOptions = cwdGlob(config.globOptions)

  return {
    ...argsWithReporter(argv),
    files: globWithOptions(patterns)
  }
}
