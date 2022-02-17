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
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadSurveyResultRepositoryStub.surveyId).toBe('any_survey_id')
    expect(loadSurveyResultRepositoryStub.accountId).toBe('any_account_id')
  })

  it('Should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const result = await sut.load('any_survey_id', 'any_account_id')
    expect(result).toBe(loadSurveyResultRepositoryStub.result)
  })
})
