import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyByIdRepositoryStub } from '@/tests/data/mocks'

interface SutTypes {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepositoryStub
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}

describe('LoadSurveyById', () => {
  it('Should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    await sut.loadById('any_id')
    expect(loadSurveyByIdRepositoryStub.id).toBe('any_id')
  })
})
