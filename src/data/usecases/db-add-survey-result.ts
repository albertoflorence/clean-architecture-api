import { AddSurveyResult } from '@/domain/usecases'
import {
  AddSurveyResultRepository,
  LoadSurveyResultRepository
} from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'

export class DbAddSurveyResult implements AddSurveyResult {
  constructor(
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async add(data: AddSurveyResult.Params): AddSurveyResult.Result {
    await this.addSurveyResultRepository.add(data)
    return (await this.loadSurveyResultRepository.loadBySurveyId(
      data.surveyId,
      data.accountId
    )) as SurveyResultModel
  }
}
