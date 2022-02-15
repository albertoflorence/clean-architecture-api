import { AddSurveyResultController } from '@/presentation/controllers'
import {
  AddSurveyResultStub,
  LoadSurveyByIdStub
} from '@/tests/presentation/mocks'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: AddSurveyResultController
  loadSurveyByIdStub: LoadSurveyByIdStub
  addSurveyResult: AddSurveyResultStub
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const addSurveyResult = new AddSurveyResultStub()
  const sut = new AddSurveyResultController(loadSurveyByIdStub, addSurveyResult)

  return { sut, loadSurveyByIdStub, addSurveyResult }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

describe('AddSurveyResult Controller', () => {
  it('Should call LoadSurveyById with correct values', async () => {
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

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementation(throwError)
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = {
      ...mockRequest(),
      body: {
        answer: 'wrong_answer'
      }
    }
    const httpResponse = await sut.handler(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call AddSurveyResult with correct values', async () => {
    const { sut, addSurveyResult, loadSurveyByIdStub } = makeSut()
    const { body, params, accountId } = mockRequest()
    jest.useFakeTimers()
    jest.setSystemTime(new Date())
    await sut.handler(mockRequest())
    expect(addSurveyResult.params).toEqual({
      surveyId: params.surveyId,
      accountId: accountId,
      answer: body.answer,
      question: loadSurveyByIdStub.result?.question,
      date: new Date()
    })
  })
})
