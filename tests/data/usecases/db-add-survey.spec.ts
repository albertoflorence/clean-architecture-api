import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepositoryStub } from '@/tests/data/mocks'
import { mockAddSurveyParams } from '../../domain/mocks'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepositoryStub
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('Db AddSurvey', () => {
  it('Should call AddSurveyRepository with correct value', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    await sut.add(mockAddSurveyParams())
    expect(addSurveyRepositoryStub.params).toEqual(mockAddSurveyParams())
  })
})
