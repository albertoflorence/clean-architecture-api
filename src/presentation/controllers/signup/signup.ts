import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  InvalidParamError,
  MissingParamError,
  badRequest,
  serverError,
  AddAccount
} from './signupProtocols'

interface BodyProps {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  public handler = (httpRequest: HttpRequest): HttpResponse => {
    const { body } = httpRequest
    const { name, email, password } = body

    try {
      this.checkParams(body)
      this.checkPasswordConfirm(body)
      this.checkEmailValidator(body)
      const account = this.addAccount.add({ name, email, password })
      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'Error') {
        return badRequest(error)
      }
      return serverError()
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
