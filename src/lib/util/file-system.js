import { compose, tryCatch } from 'ramda'
import { Maybe, Identity } from 'ramda-fantasy'
import fs from 'fs'

// fsStat :: String -> Maybe Object
const fsStat = compose(Maybe, tryCatch(fs.statSync, () => null))

// fsIsDirectory :: Maybe Object -> Maybe Boolean
const fsIsDirectory = m =>
  m.isNothing
    ? Identity(false)
    : m.chain((x) => Identity(x.isDirectory()))

// isDirectory :: String -> Identity Boolean
const isDirectory = compose(fsIsDirectory, fsStat)

// readFile :: String -> Maybe String
const readFile = compose(Maybe, tryCatch(fs.readFileSync, () => null))

export {
  fsStat,
  fsIsDirectory,
  isDirectory,
  readFile
}
