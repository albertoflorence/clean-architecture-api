import { ok } from '../../helpers'
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
    this.validation.validate(body)
    return ok('add survey')
  }
}
