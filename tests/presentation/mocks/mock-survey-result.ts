import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResult, LoadSurveyResult } from '@/domain/usecases'
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

export class LoadSurveyResultStub implements LoadSurveyResult {
  surveyId = ''
  accountId = ''
  result: SurveyResultModel | null = mockSurveyResultModel()

  async load(surveyId: string, accountId: string): LoadSurveyResult.Result {
    this.surveyId = surveyId
    this.accountId = accountId
    return this.result
  }
}
