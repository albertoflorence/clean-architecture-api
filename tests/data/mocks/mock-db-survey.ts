import { AddSurvey, AddSurveyModel } from '@/domain/usecases'
import {
  defaultValues,
  mockAddSurveyParams,
  mockSurveyCollection
} from '@/tests/domain/mocks'
import { LoadSurveysRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'

export class AddSurveyRepositoryStub implements AddSurvey {
  params: AddSurveyModel = defaultValues(mockAddSurveyParams())
  async add(data: AddSurveyModel): Promise<void> {
    this.params = data
  }
}

export class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  result = mockSurveyCollection()
  async load(): Promise<SurveyModel[]> {
    return this.result
  }
}
