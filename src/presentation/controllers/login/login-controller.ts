import {
  Authentication,
  badRequest,
  serverError,
  unauthorized,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  ok
} from './login-controller-protocols'
export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { body } = httpRequest
      const { email, password } = body
      const error = this.validation.validate(body)
      if (error) return badRequest(error)

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
