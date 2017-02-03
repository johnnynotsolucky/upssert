import { always, compose, gte, chain } from 'ramda'
import { Either } from 'ramda-fantasy'
import { prependStr, toDecimalPrecision } from './functional-utils'

const hours = always(3600000)
const minutes = always(60000)
const seconds = always(1000)
const milliseconds = always(1)

// formatTime :: String -> Integer -> Number -> String
const formatTimeUnit = (t, p) => compose(prependStr(t), toDecimalPrecision(p))

// millisTo :: Integer -> Integer -> Integer
const millisTo = d => ms => ms / d

// maybeApply :: (String -> Integer -> Number -> String) -> Either String Number
const eitherFormat = f => m =>
  m.isRight ? Either.Left(f(m.value)) : Either.Right(m.value)

// maybeApply :: (Number -> Number) -> Either Number
const eitherApply = f => x => {
  const applied = f(x)
  return gte(applied, 1) ? Either.Right(applied) : Either.Left(x)
}

// convertTimeUnit :: ((Number -> Number) -> Either Number) -> ((Number -> String) -> Either Number
const convertTimeUnit = (apply, format) =>
  compose(eitherFormat(format), eitherApply(apply))

// mapToUnitFormat :: Integer -> Either String
const mapToUnitFormat = compose(
  chain(convertTimeUnit(millisTo(milliseconds()), formatTimeUnit('ms', 0))),
  chain(convertTimeUnit(millisTo(seconds()), formatTimeUnit('s', 3))),
  chain(convertTimeUnit(millisTo(minutes()), formatTimeUnit('m', 3))),
  convertTimeUnit(millisTo(hours()), formatTimeUnit('h', 3))
)

export {
  mapToUnitFormat
}
