import { compose } from 'ramda'
import { Future } from 'ramda-fantasy'

import httpstat from 'httpstat'

// destructureParams :: a -> [b]
const destructureParams = x => ([
  x.url,
  { method: x.method },
  x.headers,
  x.data,
  x.form
])

// httpstatFuture :: [a] -> Future b
const httpstatFuture = params =>
  Future((rej, res) => httpstat(...params).then(res).catch(rej))

// httpstatFuture :: a -> Future b
const executeRequest = compose(httpstatFuture, destructureParams)

export { executeRequest }

// TODO replace with `httpstatFuture`
export default async (request) => await httpstat(...destructureParams(request))
