import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest, serverError } from '../helpers/httpHelpper'
import { Controller } from '../protocols/controllers'
import { InvalidParamError } from '../errors/invalidParamError'

export interface EmailValidator {
  isValid: (email: string) => boolean
}

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
