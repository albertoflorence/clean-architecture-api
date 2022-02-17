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
  async add(
    data: AddSurveyResultRepository.Params
  ): AddSurveyResultRepository.Result {
    this.params = data
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
