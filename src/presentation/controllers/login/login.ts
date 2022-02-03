import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { body } = httpRequest
    if (!('email' in body)) return badRequest(new MissingParamError('email'))
    if (!('password' in body)) {
      return badRequest(new MissingParamError('password'))
    }
    return await Promise.resolve({
      body: null,
      statusCode: 200
    })
  }
}
