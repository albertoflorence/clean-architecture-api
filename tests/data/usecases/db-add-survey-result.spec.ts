import { DbAddSurveyResult } from '@/data/usecases'

import { mockAddSurveyResultParams } from '@/tests/domain/mocks'
import {
  AddSurveyResultRepositoryStub,
  LoadSurveyResultRepositoryStub
} from '@/tests/data/mocks'

interface SutTypes {
  sut: DbAddSurveyResult
  addSurveyResultRepositoryStub: AddSurveyResultRepositoryStub
  loadSurveyResultRepositoryStub: LoadSurveyResultRepositoryStub
}

const makeSut = (): SutTypes => {
  const addSurveyResultRepositoryStub = new AddSurveyResultRepositoryStub()
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
  const sut = new DbAddSurveyResult(
    addSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  )
  return { sut, addSurveyResultRepositoryStub, loadSurveyResultRepositoryStub }
}

describe('Db AddSurvey', () => {
  it('Should call AddSurveyResultRepository with correct values', async () => {
    const { sut, addSurveyResultRepositoryStub } = makeSut()
    await sut.add(mockAddSurveyResultParams())
    expect(addSurveyResultRepositoryStub.params).toEqual(
      mockAddSurveyResultParams()
    )
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const params = mockAddSurveyResultParams()
    await sut.add(params)
    expect(loadSurveyResultRepositoryStub.surveyId).toBe(params.surveyId)
    expect(loadSurveyResultRepositoryStub.accountId).toBe(params.accountId)
  })

  it('Should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const surveyResult = await sut.add(mockAddSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositoryStub.result)
  })
})
