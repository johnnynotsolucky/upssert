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
const readRuncom = () => {
  const read = compose(inverseMaybeEither, readConfig)
  return read('.upssertrc')
}

// readClientPackage :: String
const readClientPackage = () => {
  const read = compose(inverseMaybeEither, readConfig)
  return read('package.json')
    .bimap(propOr(null, 'upssert'), F)
}

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
