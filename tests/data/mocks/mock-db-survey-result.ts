import { AddSurveyResult } from '@/domain/usecases'
import {
  defaultValues,
  mockAddSurveyResultParams,
  mockSurveyResultModel
} from '@/tests/domain/mocks'
import { AddSurveyResultRepository } from '@/data/protocols'

export class AddSurveyResultRepositoryStub
  implements AddSurveyResultRepository
{
  params = defaultValues(mockAddSurveyResultParams())
  result = mockSurveyResultModel()
  async add(data: AddSurveyResult.Params): AddSurveyResult.Result {
    this.params = data
    return this.result
  }
}
