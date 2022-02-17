import { DbLoadSurveyResult } from '@/data/usecases'
import { SurveyModel } from '@/domain/models'
import {
  LoadSurveyByIdRepositoryStub,
  LoadSurveyResultRepositoryStub
} from '@/tests/data/mocks'
import { makeEmptySurveyResult } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepositoryStub
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  )
  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

const surveyId = 'any_survey_id'
const accountId = 'any_account_id'

describe('Db Load Survey Result', () => {
  it('Should call LoadSurveyResultRepository witch correct value', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositoryStub.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositoryStub.accountId).toBe(accountId)
  })

  it('Should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const result = await sut.load(surveyId, accountId)
    expect(result).toBe(loadSurveyResultRepositoryStub.result)
  })

  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository return null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub
    } = makeSut()
    loadSurveyResultRepositoryStub.result = null
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositoryStub.id).toBe(surveyId)
  })

  it('Should return a survey result if LoadSurveyByIdRepository return a survey', async () => {
    const {
      sut,
      loadSurveyByIdRepositoryStub,
      loadSurveyResultRepositoryStub
    } = makeSut()
    loadSurveyResultRepositoryStub.result = null
    const result = await sut.load(surveyId, accountId)
    const survey = loadSurveyByIdRepositoryStub.result as SurveyModel

    expect(result).toEqual(makeEmptySurveyResult(survey))
  })
})
