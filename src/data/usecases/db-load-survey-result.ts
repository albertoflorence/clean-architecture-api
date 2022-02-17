import { LoadSurveyResult } from '@/domain/usecases'
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository
} from '@/data/protocols'
import { SurveyModel, SurveyResultModel } from '@/domain/models'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string, accountId: string): LoadSurveyResult.Result {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId
    )
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      if (survey) {
        surveyResult = this.makeEmptySurveyResult(survey)
      }
    }

    return surveyResult
  }

  private makeEmptySurveyResult(survey: SurveyModel): SurveyResultModel {
    const surveyResult = {
      question: survey.question,
      surveyId: survey.id,
      date: survey.date,
      answers: survey.answers.map(answer => ({
        ...answer,
        count: 0,
        percent: 0
      }))
    }

    return surveyResult
  }
}
