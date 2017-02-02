import { compose, tryCatch } from 'ramda'
import { Maybe } from 'ramda-fantasy'
import { readFile } from './file-system'

// parseJson :: String -> Maybe Object
const parseJson = compose(Maybe, tryCatch(JSON.parse, () => null))

// readJsonFile :: String -> Maybe Object
const readJsonFile = file => readFile(file).chain(parseJson)

export {
  parseJson,
  readJsonFile
}
