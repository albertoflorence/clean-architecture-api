import { badRequest } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'
export class LoginController implements Controller {
  constructor(private readonly validation: Validation) {}

  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const { body } = httpRequest
    const error = this.validation.validate(body)
    if (error) return badRequest(error)

    return await Promise.resolve({
      body: null,
      statusCode: 200
    })
  }
}
