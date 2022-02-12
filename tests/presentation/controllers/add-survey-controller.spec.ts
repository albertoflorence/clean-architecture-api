import { badRequest, serverError, noContent } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers'
import { AddSurveyStub, ValidationStub } from '@/tests/presentation/mocks'
import { mockAddSurveyParams, throwError } from '../../domain/mocks'

interface SutTypes {
  sut: AddSurveyController
  validationStub: ValidationStub
  addSurveyStub: AddSurveyStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const addSurveyStub = new AddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return { sut, validationStub, addSurveyStub }
}

const mockRequest = (): HttpRequest => ({
  body: mockAddSurveyParams()
})

describe('Add Survey Controller', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    await sut.handler(mockRequest())
    expect(validationStub.input).toEqual(mockRequest().body)
  })

  it('Should return 400 if validation returns error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.useFakeTimers()
    jest.setSystemTime(new Date())
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handler(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      ...mockRequest().body,
      date: new Date()
    })
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
