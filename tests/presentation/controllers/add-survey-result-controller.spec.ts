import { AddSurveyResultController } from '@/presentation/controllers'
import { LoadSurveyByIdStub } from '@/tests/presentation/mocks'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'

interface SutTypes {
  sut: AddSurveyResultController
  loadSurveyByIdStub: LoadSurveyByIdStub
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const sut = new AddSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

describe('AddSurveyResult Controller', () => {
  it('Should return LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handler(mockRequest())
    expect('any_survey_id').toEqual(loadSurveyByIdStub.id)
  })

  it('Should return 403 LoadSurveyById if returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    loadSurveyByIdStub.result = null
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
