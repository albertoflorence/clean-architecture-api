import {
  Authentication,
  badRequest,
  serverError,
  unauthorized,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from './login-protocols'
export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) return badRequest(error)

      const auth = await this.authentication.auth(body.email, body.password)
      if (!auth) return unauthorized()
      return await Promise.resolve({
        body: null,
        statusCode: 200
      })
    } catch (error) {
      return serverError(error instanceof Error ? error : undefined)
    }
  }
}
