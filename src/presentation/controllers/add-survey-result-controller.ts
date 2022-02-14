import { LoadSurveyById } from '@/domain/usecases'
import { forbidden, ok } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class AddSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (survey === null) return forbidden(new InvalidParamError('surveyId'))
    return ok({})
  }
}
