import { curry, compose, filter, keys, pick, indexOf } from 'ramda'

// prefixOrEmpty :: String -> String
const prefixOrEmpty = p => p || ''

// keyWithPrefix :: -> String -> String -> Boolean
const keyWithPrefix = curry((p, k) => indexOf(prefixOrEmpty(p), k) === 0)

// filterKeysByPrefix -> String -> [String] -> [String]
const filterKeysByPrefix = p => filter(keyWithPrefix(p))

// selectKeys :: String -> Object -> [String]
const selectKeys = p => compose(filterKeysByPrefix(p), keys)

// getGlobals :: String -> Object -> Object
const getGlobals = curry((p, a) => {
  const select = selectKeys(p)
  return pick(select(a), a)
})

export default getGlobals
