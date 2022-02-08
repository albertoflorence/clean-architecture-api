import { AddSurvey, AddSurveyModel } from '../../../domain/usecases'
import { DbAddSurvey } from './db-add-survey'

class AddSurveyRepositoryStub implements AddSurvey {
  async add(data: AddSurveyModel): Promise<void> {}
}

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    }
  ]
})

describe('Db AddSurvey', () => {
  it('Should call AddSurveyRepository with correct value', async () => {
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add(makeFakeAddSurveyData())
    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSurveyData())
  })
})
