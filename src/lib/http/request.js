import { render } from '../util/render'
import generateToken from '../util/generate-token'

class HttpRequest {
  constructor (request, model, config) {
    this.model = model
    this.initialize(request)
    this.unescaped = config && config.unescaped
  }

  initialize (request) {
    this.url = this.renderUrl(request.url)
    this.method = this.renderRequestMethod(request.method)
    this.form = this.renderFormData(request)
    this.data = this.renderData(request)
    this.headers = this.renderRequestHeaders(request)
    this.trace = this.addTraceHeader()
  }

  renderUrl (url) {
    let result
    if (url) {
      result = render(url)(this.model)
    }
    return result
  }

  renderRequestMethod (method) {
    let result
    if (method) {
      result = render(method)(this.model)
    } else {
      result = 'GET'
    }
    return result
  }

  renderFormData (request) {
    let form
    if (request.form) {
      form = []
      for (const item of request.form) {
        const renderedKey = render(item.key)(this.model)
        const renderedValue = render(item.value)(this.model)
        const formItem = `${renderedKey}=${renderedValue}`
        form.push(formItem)
      }
    }
    return form
  }

  renderData (request) {
    let data
    if (request.data) {
      if (typeof request.data === 'string') {
        data = request.data
      } else if (typeof request.data === 'object') {
        data = this.renderDataFromObject(request.data)
      }
      data = render(data)(this.model)
    }
    return data
  }

  renderDataFromObject (obj) {
    let rendered = ''
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === 'string') {
        const part = `${key}=${obj[key]}`
        rendered = `${rendered}&${part}`
      }
    }
    return rendered.substr(1)
  }

  renderRequestHeaders (request) {
    const headers = []
    if (request.headers) {
      Object.keys(request.headers).forEach((key) => {
        const value = request.headers[key]
        const concatenated = `${key}: ${render(value)(this.model)}`
        headers.push(concatenated)
      })
    }
    return headers
  }

  addTraceHeader () {
    const token = generateToken()
    this.headers.push(`X-Upssert-Trace: ${token}`)
    return token
  }
}

export default HttpRequest
