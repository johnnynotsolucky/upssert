import { compose, propOr, merge, F } from 'ramda'
import { readJsonFile } from './util/json'
import { inverseMaybeEither } from './util/functional-utils'

// defaultConfig :: Object
const defaultConfig = () => ({
  globOpts: [],
  testDir: `${process.cwd()}/test/api/**/*.json`,
  envPrefix: false
})

// readConfig :: String -> String
const readConfig = file => readJsonFile(`${process.cwd()}/${file}`)

// readRuncom :: String
const readRuncom = () =>
  compose(inverseMaybeEither, readConfig)('.upssertrc')

// readClientPackage :: String
const readClientPackage = () =>
  compose(inverseMaybeEither, readConfig)('package.json')
    .bimap(propOr(null, 'upssert'), F)

// mergeConfigs :: Object -> Object
const mergeConfigs = merge(defaultConfig())

// getConfig :: Object
const getConfig = () => {
  return readRuncom()
    .chain(readClientPackage)
    .bimap(mergeConfigs, mergeConfigs)
}

export {
  getConfig
}
