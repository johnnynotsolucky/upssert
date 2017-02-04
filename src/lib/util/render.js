import { compose, curry, reduce, replace, match } from 'ramda'
import Mustache from 'mustache'
import { charCodeToString, entityToHex } from './functional-utils'

// renderView :: String -> Object -> String
const renderView = curry((view, model) => Mustache.render(view, model))

// findEscapedEntities :: String -> [String]
const findEscapedEntities = x => match(/&#x[a-fA-F0-9][a-fA-F0-9];/g, x) || []

// replaceEntityWithHex :: String -> String -> String
const replaceEntityWithHex = curry((s, x) =>
    replace(x, charCodeToString(entityToHex(x)), s))

// replaceEscapedEntities :: String -> String
const replaceEscapedEntities = str => {
  const replaceWithHex = reduce(replaceEntityWithHex, str)
  return replaceWithHex(findEscapedEntities(str))
}

// render :: String -> Object -> String
const render = view => compose(replaceEscapedEntities, renderView(view))

export {
  render
}
