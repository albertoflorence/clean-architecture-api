import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResultRepositoryStub } from '@/tests/data/mocks'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()

  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)
  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('Db Load Survey Result', () => {
  it('Should call LoadSurveyResultRepository witch correct value', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    await sut.load('any_id')
    expect(loadSurveyResultRepositoryStub.surveyId).toBe('any_id')
  })
})
