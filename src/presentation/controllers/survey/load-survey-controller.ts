import { LoadSurveys } from '@/domain/usecases'
import { ok, serverError, noContent } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

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
