import { compose, propOr, merge, F, chain } from 'ramda'
import { readJsonFile } from './util/json'
import { value, bimap, inverseMaybeEither } from './util/functional-utils'

// defaultConfig :: Object
const defaultConfig = () => ({
  globOpts: [],
  pattern: `${process.cwd()}/test/api/**/*.json`,
  envPrefix: false
})

// readConfig :: String -> String
const readConfig = file => readJsonFile(`${process.cwd()}/${file}`)

// readRuncom :: Either String
const readRuncom = () => {
  const read = compose(inverseMaybeEither(null), readConfig)
  return read('.upssertrc')
}

// readClientPackage :: Either String
const readClientPackage = () => {
  const read = compose(inverseMaybeEither(null), readConfig)
  return read('package.json')
    .bimap(propOr(null, 'upssert'), F)
}

// mergeConfigs :: Object -> Object
const mergeConfigs = merge(defaultConfig())

// getConfig :: Object
const getConfig =
  compose(value, bimap(mergeConfigs, mergeConfigs), chain(readClientPackage), readRuncom)

export {
  getConfig
}
