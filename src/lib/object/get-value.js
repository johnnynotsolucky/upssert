import {
  curry,
  concat,
  compose,
  map,
  replace,
  path,
  match,
  split,
  flatten
} from 'ramda'
import falsy from 'falsy'

// trimBrackets :: String -> String
const trimBrackets = replace(/\[|\]/g, '')

// bracketNotation :: Object -> String -> [String]
const bracketNotation = a => concat(match(/[^[]*/, a), match(/\[.*?\]/g, a))

// dotNotation :: String -> [String]
const dotNotation = split('.')

// propsFromKey :: String -> [String]
const propsFromKey = compose(
  map(trimBrackets),
  flatten,
  map(bracketNotation),
  dotNotation
)

const getObjectValue = curry((obj, key) =>
  falsy(key) ? obj : path(propsFromKey(key), obj))

export default getObjectValue
