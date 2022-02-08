import { AddSurvey } from '../../../domain/usecases'
import { badRequest, ok, serverError } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = this.validation.validate(body)
      if (error) return badRequest(error)

      await this.addSurvey.add(body)
      return ok('add survey')
    } catch (error) {
      return serverError(error)
    }
  }
}
