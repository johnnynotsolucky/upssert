import { curry, compose, map } from 'ramda'
import tv4 from 'tv4'
import formdataSchema from '../data/schema/formdata.json'
import requestSchema from '../data/schema/request.json'
import testSchema from '../data/schema/test.json'
import suiteSchema from '../data/schema/suite.json'

// schemas :: [a]
const schemas = () => ([
  ['formdata-schema', formdataSchema],
  ['request-schema', requestSchema],
  ['test-schema', testSchema]
])

// XXX tv4 makes things difficult
// TODO Look for alternative?

// addSchema :: a
const addSchema = x => tv4.addSchema(x[0], x[1]) // XXX Impure: Mutates tv4 object

// useSchemas ::
const useSchemas = compose(map(addSchema), schemas)

// validateAgainstSchema :: Object -> Object -> Boolean
const validateAgainstSchema = curry((s, x) => tv4.validate(x, s)) // Impure: validate mutates tv4 object

// isValid :: Boolean -> Boolean|String
const isValid = x => x ? true : tv4.error // XXX Impure

// validateSuite :: Object -> Boolean|String
const validateSuite = suite => {
  useSchemas()
  const validate = compose(isValid, validateAgainstSchema(suiteSchema))
  return validate(suite)
}

export default validateSuite
