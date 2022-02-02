import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  InvalidParamError,
  MissingParamError,
  badRequest,
  serverError,
  AddAccount,
  ok
} from './signup-protocols'

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

  public handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { body } = httpRequest
    const { name, email, password } = body

    try {
      this.checkParams(body)
      this.checkPasswordConfirm(body)
      this.checkEmailValidator(body)
      return await this.addAccount
        .add({ name, email, password })
        .then(account => ok(account))
    } catch (error) {
      if (error instanceof Error && error.name !== 'Error') {
        return badRequest(error)
      }
      return serverError(error instanceof Error ? error : undefined)
    }
  }

  private checkParams(body: BodyProps): void {
    const missingParam = ['name', 'email', 'password', 'passwordConfirm'].find(
      param => !(param in body)
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
