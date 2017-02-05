import { curry, compose, flatten, map, replace } from 'ramda'
import { Either } from 'ramda-fantasy'
import crypto from 'crypto'

// trace :: String -> a -> a
const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

// value :: a -> b
const value = x => x.value

// getOrElse :: a -> Maybe -> b
const getOrElse = curry((x, m) => m.getOrElse(x))

// flatMap :: (a -> [b]) -> [c]
const flatMap = curry((f) => compose(flatten, map(f)))

// identityOrDefault :: [a] -> a -> [a]
const arrayOrDefault = curry((args, x) => args.length ? args : [x])

// either :: a -> Boolean -> Either a
const either = curry((a, x) => x ? Either.Right(a) : Either.Left(a))

// inverseEither :: a -> Boolean -> Either a
const inverseEither = curry((a, x) => x ? Either.Left(a) : Either.Right(a))

// inverseMaybeEither :: Maybe a -> Either Null a
const inverseMaybeEither = curry((x, m) => m.isNothing ? Either.Right(x) : Either.Left(m.value))

// joinStr :: String -> String -> String -> String
const joinStr = curry((joinWith, a, b) => `${a}${joinWith}${b}`)

// inverseJoinStr :: String -> String -> String -> String
const inverseJoinStr = curry((joinWith, a, b) => joinStr(joinWith, b, a))

// appendStr :: String -> String -> String
const appendStr = joinStr('')

// prependStr :: String -> String -> String
const prependStr = inverseJoinStr('')

// toDecimalPrecision :: Integer -> Number -> String
const toDecimalPrecision = curry((p, d) => `${d.toFixed(p)}`)

// entityToHex :: String -> String
const entityToHex = compose(replace(/;/, ''), replace(/&#/, '0'))

// charCodeToString :: String -> String
const charCodeToString = String.fromCharCode

// cryptoString :: Integer -> String -> String
const cryptoString = curry((bytes, to) => crypto.randomBytes(bytes).toString(to))

const bimap = curry((f, g, x) => x.bimap(f, g))

export {
  trace,
  value,
  getOrElse,
  flatMap,
  arrayOrDefault,
  either,
  inverseEither,
  inverseMaybeEither,
  joinStr,
  inverseJoinStr,
  appendStr,
  prependStr,
  toDecimalPrecision,
  entityToHex,
  charCodeToString,
  cryptoString,
  bimap
}
