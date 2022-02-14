import { AddSurvey, LoadSurveys } from '@/domain/usecases'
import { mockSurveyCollection } from '../../domain/mocks'

export class AddSurveyStub implements AddSurvey {
  async add(data: AddSurvey.Params): AddSurvey.Result {}
}

export class LoadSurveysStub implements LoadSurveys {
  result = mockSurveyCollection()
  load = async (): LoadSurveys.Result => {
    return this.result
  }
}
