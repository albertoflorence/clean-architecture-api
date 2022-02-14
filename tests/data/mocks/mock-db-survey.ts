import {
  defaultValues,
  mockAddSurveyParams,
  mockSurveyCollection,
  mockSurveyModel
} from '@/tests/domain/mocks'
import {
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository
} from '@/data/protocols'
import { LoadSurveyById } from '@/domain/usecases'

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

export class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
  id: string = ''
  result = mockSurveyModel()
  async loadById(id: string): LoadSurveyById.Result {
    this.id = id
    return this.result
  }
}
