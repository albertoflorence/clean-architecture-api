import { AddSurveyResult } from '@/domain/usecases'
import {
  defaultValues,
  mockAddSurveyResultParams,
  mockSurveyResultModel
} from '@/tests/domain/mocks'

export class AddSurveyResultStub implements AddSurveyResult {
  result = mockSurveyResultModel()
  params = defaultValues(mockAddSurveyResultParams())
  async add(data: AddSurveyResult.Params): AddSurveyResult.Result {
    this.params = data
    return this.result
  }
}
