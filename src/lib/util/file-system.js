import { compose, tryCatch } from 'ramda'
import { Maybe } from 'ramda-fantasy'
import fs from 'fs'
import { getValue } from './foldable'

// fsStat :: String -> Maybe Object
const fsStat = compose(Maybe, tryCatch(fs.statSync, () => null))

// fsIsDirectory :: Maybe Object -> Maybe Boolean
const fsIsDirectory = m => m.map((x) => x.isDirectory())

// isDirectory :: String -> Boolean
const isDirectory = compose(getValue, fsIsDirectory, fsStat)

export {
  fsStat,
  fsIsDirectory,
  isDirectory
}
