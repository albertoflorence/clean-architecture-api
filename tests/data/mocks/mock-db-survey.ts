import {
  defaultValues,
  mockAddSurveyParams,
  mockSurveyCollection
} from '@/tests/domain/mocks'
import { AddSurveyRepository, LoadSurveysRepository } from '@/data/protocols'

export class AddSurveyRepositoryStub implements AddSurveyRepository {
  params: AddSurveyRepository.Params = defaultValues(mockAddSurveyParams())
  async add(data: AddSurveyRepository.Params): AddSurveyRepository.Result {
    this.params = data
  }
}

export class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  result = mockSurveyCollection()
  async load(): LoadSurveysRepository.Result {
    return this.result
  }
}
