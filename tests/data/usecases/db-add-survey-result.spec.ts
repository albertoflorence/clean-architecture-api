import { DbAddSurveyResult } from '@/data/usecases'

import { mockAddSurveyResultParams } from '@/tests/domain/mocks'
import { AddSurveyResultRepositoryStub } from '@/tests/data/mocks'

interface SutTypes {
  sut: DbAddSurveyResult
  addSurveyResultRepositoryStub: AddSurveyResultRepositoryStub
}

const makeSut = (): SutTypes => {
  const addSurveyResultRepositoryStub = new AddSurveyResultRepositoryStub()
  const sut = new DbAddSurveyResult(addSurveyResultRepositoryStub)
  return { sut, addSurveyResultRepositoryStub }
}

describe('Db AddSurvey', () => {
  it('Should call AddSurveyResultRepository with correct values', async () => {
    const { sut, addSurveyResultRepositoryStub } = makeSut()
    await sut.add(mockAddSurveyResultParams())
    expect(addSurveyResultRepositoryStub.params).toEqual(
      mockAddSurveyResultParams()
    )
  })

  it('Should return a survey result on success', async () => {
    const { sut, addSurveyResultRepositoryStub } = makeSut()
    const surveyResult = await sut.add(mockAddSurveyResultParams())
    expect(surveyResult).toEqual(addSurveyResultRepositoryStub.result)
  })
})
