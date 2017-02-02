import { curry, compose, flatten, map } from 'ramda'
import { Either } from 'ramda-fantasy'

// trace :: String -> a -> a
const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

// getOrElse :: a -> Maybe -> b
const getOrElse = curry((x, m) => m.getOrElse(x))

// toFlattenedArray :: (a -> [b]) -> [c]
const toFlattenedArray = curry((f) => compose(flatten, map(f)))

// identityOrDefault :: [a] -> a -> [a]
const arrayOrDefault = curry((args, defaultDir) => args.length ? args : [defaultDir])

// either :: a -> Boolean -> Either a
const either = curry((p, x) => x ? Either.Right(p) : Either.Left(p))

// inverseEither :: a -> Boolean -> Either a
const inverseEither = curry((p, x) => x ? Either.Left(p) : Either.Right(p))

// joinStr :: String -> String -> String -> String
const joinStr = curry((joinWith, a, b) => `${a}${joinWith}${b}`)

// inverseJoinStr :: String -> String -> String -> String
const inverseJoinStr = curry((joinWith, a, b) => joinStr(joinWith, b, a))

export {
  trace,
  getOrElse,
  toFlattenedArray,
  arrayOrDefault,
  either,
  inverseEither,
  joinStr,
  inverseJoinStr
}
