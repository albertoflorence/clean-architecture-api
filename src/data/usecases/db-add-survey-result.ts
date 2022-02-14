import { AddSurveyResult } from '@/domain/usecases'
import { AddSurveyResultRepository } from '@/data/protocols'

export class DbAddSurveyResult implements AddSurveyResult {
  constructor(
    private readonly addSurveyResultRepository: AddSurveyResultRepository
  ) {}

  async add(data: AddSurveyResult.Params): AddSurveyResult.Result {
    return await this.addSurveyResultRepository.add(data)
  }
}
