import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { ok, serverError, noContent } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys.length === 0 ? noContent() : ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
