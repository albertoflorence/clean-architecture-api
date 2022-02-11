import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveysRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'

class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  load = async (): Promise<SurveyModel[]> => [makeFakeSurvey()]
}

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()

  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
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

describe('Db Load Surveys', () => {
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  it('Should return surveys on LoadSurveysRepository success', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'load')
    const surveys = await sut.load()
    expect(surveys).toEqual([makeFakeSurvey()])
  })
})
