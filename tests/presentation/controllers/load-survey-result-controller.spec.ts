import { LoadSurveyByIdStub } from '@/tests/presentation/mocks'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'

interface SutTypes {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyByIdStub
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

describe('Load Survey Result Controller', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handler(mockRequest())
    expect(loadSurveyByIdStub.id).toBe('any_survey_id')
  })
})
