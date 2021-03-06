import { AddSurvey } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'

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

      const { question, answers } = body

      await this.addSurvey.add({ question, answers, date: new Date() })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
