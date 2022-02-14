import { SurveyModel } from '@/domain/models'
import { AddSurvey, LoadSurveyById, LoadSurveys } from '@/domain/usecases'
import { mockSurveyCollection, mockSurveyModel } from '@/tests/domain/mocks'

export class AddSurveyStub implements AddSurvey {
  async add(data: AddSurvey.Params): AddSurvey.Result {}
}

export class LoadSurveysStub implements LoadSurveys {
  result = mockSurveyCollection()
  load = async (): LoadSurveys.Result => {
    return this.result
  }
}

export class LoadSurveyByIdStub implements LoadSurveyById {
  id: string = ''
  result: SurveyModel | null = mockSurveyModel()
  async loadById(id: string): LoadSurveyById.Result {
    this.id = id
    return this.result
  }
}
