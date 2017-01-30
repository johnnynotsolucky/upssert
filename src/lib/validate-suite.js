import tv4 from 'tv4'
import formdataSchema from '../data/schema/formdata.json'
import requestSchema from '../data/schema/request.json'
import testSchema from '../data/schema/test.json'
import suiteSchema from '../data/schema/suite.json'

export default (suite) => {
  let result
  tv4.addSchema('formdata-schema', formdataSchema)
  tv4.addSchema('request-schema', requestSchema)
  tv4.addSchema('test-schema', testSchema)
  const testIsValid = tv4.validate(suite, suiteSchema)
  if (testIsValid) {
    result = true
  } else {
    result = tv4.error
  }
  return result
}
