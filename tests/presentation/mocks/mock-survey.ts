import { SurveyModel } from '@/domain/models'
import { AddSurvey, AddSurveyModel, LoadSurveys } from '@/domain/usecases'
import { mockSurveyCollection } from '../../domain/mocks'

export class AddSurveyStub implements AddSurvey {
  async add(data: AddSurveyModel): Promise<void> {}
}

export class LoadSurveysStub implements LoadSurveys {
  result = mockSurveyCollection()
  load = async (): Promise<SurveyModel[]> => {
    return this.result
  }
}
