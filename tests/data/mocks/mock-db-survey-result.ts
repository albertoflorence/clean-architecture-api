import { AddSurveyResult } from '@/domain/usecases'
import {
  defaultValues,
  mockAddSurveyResultParams,
  mockSurveyResultModel
} from '@/tests/domain/mocks'
import {
  AddSurveyResultRepository,
  LoadSurveyResultRepository
} from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'

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

export class LoadSurveyResultRepositoryStub
  implements LoadSurveyResultRepository
{
  surveyId = ''
  accountId = ''
  result: SurveyResultModel | null = mockSurveyResultModel()

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): LoadSurveyResultRepository.Result {
    this.surveyId = surveyId
    this.accountId = accountId
    return this.result
  }
}
