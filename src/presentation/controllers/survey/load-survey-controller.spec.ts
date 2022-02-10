import { LoadSurveysController } from './load-survey-controller'
import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { SurveyModel } from '../../../domain/models/survey'
import { noContent, ok, serverError } from '../../helpers/http-helper'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysSub: any
}

class LoadSurveysSub implements LoadSurveys {
  load = async (): Promise<SurveyModel[]> => [makeFakeSurvey()]
}

const makeSut = (): SutTypes => {
  const loadSurveysSub = new LoadSurveysSub()
  const sut = new LoadSurveysController(loadSurveysSub)

  return { sut, loadSurveysSub }
}

const fakeDate = new Date()
const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ],
  date: fakeDate
})

describe('Load Survey Controller', () => {
  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysSub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveysSub, 'load')

    await sut.handler({})
    expect(spyLoad).toHaveBeenCalled()
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(ok([makeFakeSurvey()]))
  })

  it('Should return 500 if LordSurveys throws ', async () => {
    const { sut, loadSurveysSub } = makeSut()
    jest.spyOn(loadSurveysSub, 'load').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSub } = makeSut()
    jest.spyOn(loadSurveysSub, 'load').mockReturnValueOnce(async () => [])
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(noContent())
  })
})
