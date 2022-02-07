import {
  HttpRequest,
  HttpResponse,
  Controller,
  badRequest,
  serverError,
  AddAccount,
  Validation,
  redirect
} from './signup-controller-protocols'

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

      await this.addAccount.add({ name, email, password })

      return redirect('login', 307)
    } catch (error) {
      return serverError(error)
    }
  }
}
