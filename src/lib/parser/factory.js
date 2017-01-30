import jsonParser from './json'
import contentTypes from '../../data/content-types.json'

export default (contentType) => {
  switch (contentType) {
    case contentTypes.JSON:
      return jsonParser
    default:
      return data => data
  }
}
