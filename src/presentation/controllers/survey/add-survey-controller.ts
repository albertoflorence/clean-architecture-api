import { badRequest, ok } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const error = this.validation.validate(body)
    if (error) return badRequest(error)
    return ok('add survey')
  }
}
