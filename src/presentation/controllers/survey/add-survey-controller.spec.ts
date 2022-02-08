import { badRequest, serverError } from '../../helpers'
import { HttpRequest, Validation } from '../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { AddSurvey, AddSurveyModel } from '../../../domain/usecases'
class ValidationStub implements Validation {
  validate = (input: any): Error | null => null
}

class AddSurveyStub implements AddSurvey {
  add = async (data: AddSurveyModel): Promise<void> => {}
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const addSurveyStub = new AddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return { sut, validationStub, addSurveyStub }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
})

describe('Add Survey Controller', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handler(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if validation returns error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    await sut.handler(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest
      .spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
