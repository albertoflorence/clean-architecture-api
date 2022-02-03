import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { body } = httpRequest
    if (!('email' in body)) return badRequest(new MissingParamError('email'))
    if (!('password' in body)) {
      return badRequest(new MissingParamError('password'))
    }
    if (!this.emailValidator.isValid(body.email)) {
      return badRequest(new InvalidParamError('email'))
    }
    return await Promise.resolve({
      body: null,
      statusCode: 200
    })
  }
}
