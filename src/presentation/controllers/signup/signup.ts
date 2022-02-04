import {
  HttpRequest,
  HttpResponse,
  Controller,
  badRequest,
  serverError,
  AddAccount,
  ok,
  Validation
} from './signup-protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  public handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { body } = httpRequest
      const { name, email, password } = body

      const error = this.validation.validate(body)
      if (error) return badRequest(error)

      return await this.addAccount
        .add({ name, email, password })
        .then(account => ok(account))
    } catch (error) {
      return serverError(error)
    }
  }
}
