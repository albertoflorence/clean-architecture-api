import { badRequest, serverError } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'
export class LoginController implements Controller {
  constructor(private readonly validation: Validation) {}

  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) return badRequest(error)

      return await Promise.resolve({
        body: null,
        statusCode: 200
      })
    } catch (error) {
      return serverError(error instanceof Error ? error : undefined)
    }
  }
}
