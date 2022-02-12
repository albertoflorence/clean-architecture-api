import { DbLoadSurveys } from '@/data/usecases'
import { LoadSurveysRepositoryStub } from '@/tests/data/mocks'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()

  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('Db Load Surveys', () => {
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'load')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  it('Should return surveys on LoadSurveysRepository success', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(loadSurveysRepositoryStub.result)
  })
})
