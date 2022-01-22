import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator
} from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  handler = (httpRequest: HttpRequest): HttpResponse => {
    const missingParam = ['name', 'email', 'password', 'passwordConfirm'].find(
      param => !httpRequest.body[param]
    )
    if (missingParam) {
      return badRequest(new MissingParamError(missingParam))
    }

    try {
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch {
      return serverError()
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
