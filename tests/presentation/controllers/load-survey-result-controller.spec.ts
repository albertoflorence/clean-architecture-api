import {
  LoadSurveyByIdStub,
  LoadSurveyResultStub
} from '@/tests/presentation/mocks'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { throwError } from '@/tests/domain/mocks'
import { InvalidParamError } from '@/presentation/errors'

interface SutTypes {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyByIdStub
  loadSurveyResultStub: LoadSurveyResultStub
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const loadSurveyResultStub = new LoadSurveyResultStub()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub
  )

  return { sut, loadSurveyByIdStub, loadSurveyResultStub }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  accountId: 'any_account_id'
})

describe('Load Survey Result Controller', () => {
  it('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handler(mockRequest())
    expect(loadSurveyByIdStub.id).toBe('any_survey_id')
  })

  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    loadSurveyByIdStub.result = null
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementation(throwError)
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()

    await sut.handler(mockRequest())
    expect(loadSurveyResultStub.surveyId).toBe('any_survey_id')
    expect(loadSurveyResultStub.accountId).toBe('any_account_id')
  })

  it('Should return 200 on success', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyResultStub.result))
  })
})
