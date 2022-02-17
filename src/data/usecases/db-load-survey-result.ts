import { LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultRepository } from '@/data/protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load(surveyId: string, accountId: string): LoadSurveyResult.Result {
    return await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId
    )
  }
}
