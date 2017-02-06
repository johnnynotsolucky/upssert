import { compose, propOr, merge, F, chain } from 'ramda'
import { readJsonFile } from './util/json'
import { fold, bimap, inverseMaybeEither } from './util/functional-utils'

// defaultConfig :: Object
const defaultConfig = proc => ({
  globOpts: [],
  pattern: `${proc.cwd()}/test/api/**/*.json`,
  envPrefix: false
})

// readConfig :: String -> Either Object
const readConfig = compose(inverseMaybeEither(null), readJsonFile)

// readRuncom :: Object -> Either Object
const readRuncom = proc => () => readConfig(`${proc.cwd()}/.upssertrc`)

// readClientPackage :: Object -> Either Object
const readClientPackage = proc => () =>
  readConfig(`${proc.cwd()}/package.json`)
    .bimap(propOr(null, 'upssert'), F)

// getConfig :: Object -> Object
const getConfig = proc => {
  const defaultConf = defaultConfig(proc)
  const mergeConfig = merge(defaultConf)
  const f = compose(
    fold,
    bimap(mergeConfig, mergeConfig),
    chain(readClientPackage(proc)),
    readRuncom(proc)
  )
  return f()
}

export {
  getConfig
}
