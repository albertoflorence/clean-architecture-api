import { AddSurveyModel } from '../../../../domain/usecases'
import { MongoDbHelper, Collection } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    { answer: 'another_answer' }
  ]
})

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoDbHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  it('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeAddSurveyData())
    const survey = await surveyCollection.findOne(makeFakeAddSurveyData())
    expect(survey).toBeTruthy()
  })
})
