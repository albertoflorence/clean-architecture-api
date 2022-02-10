import { AddSurveyModel } from '../../../../domain/usecases'
import { MongoDbHelper, Collection } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const fakeDate = new Date()
const makeFakeAddSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    { answer: 'another_answer' }
  ],
  date: fakeDate
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

  describe('add', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeAddSurveyData())
      const survey = await surveyCollection.findOne(makeFakeAddSurveyData())
      expect(survey).toBeTruthy()
    })
  })

  describe('load', () => {
    it('Should load surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([
        makeFakeAddSurveyData(),
        makeFakeAddSurveyData()
      ])
      const surveys = await sut.load()

      expect(surveys.length).toBe(2)
      expect(surveys[0].answers).toEqual(makeFakeAddSurveyData().answers)
    })
  })
})
