import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator
} from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers'

interface BodyProps {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  handler = (httpRequest: HttpRequest): HttpResponse => {
    try {
      this.checkParams(httpRequest.body)
      this.checkPasswordConfirm(httpRequest.body)
      this.checkEmailValidator(httpRequest.body)
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'Error') return serverError()
        return badRequest(error)
      }
    }
    return {
      statusCode: 200,
      body: {}
    }
  }

  private checkParams(body: BodyProps): void {
    const missingParam = ['name', 'email', 'password', 'passwordConfirm'].find(
      param => !Object.prototype.hasOwnProperty.call(body, param)
    )

    if (missingParam) {
      throw new MissingParamError(missingParam)
    }
  }

  private checkPasswordConfirm(body: BodyProps): void {
    if (body.password !== body.passwordConfirm) {
      throw new InvalidParamError('passwordConfirm')
    }
  }

  private checkEmailValidator(body: BodyProps): void {
    const isValid = this.emailValidator.isValid(body.email)
    if (!isValid) {
      throw new InvalidParamError('email')
    }
  }
}
