import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return ok(surveys)
  }
}
