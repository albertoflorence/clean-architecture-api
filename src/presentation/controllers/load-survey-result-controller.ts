import { LoadSurveyById } from '@/domain/usecases'
import { forbidden, ok } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return ok({})
  }
}
