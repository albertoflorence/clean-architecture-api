import { MongoDbHelper, SurveyResultMongoRepository } from '@/infra/db'
import { Collection } from 'mongodb'
import { mockMongoAccount, mockMongoSurvey } from '@/tests/infra/db'

let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    surveyResultCollection = MongoDbHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    await MongoDbHelper.getCollection('accounts').deleteMany({})
    await MongoDbHelper.getCollection('surveys').deleteMany({})
  })

  describe('add', () => {
    it('Should add a survey result', async () => {
      const sut = makeSut()
      const account = await mockMongoAccount()
      const survey = await mockMongoSurvey()

      const surveyResultParams = {
        accountId: account.id,
        surveyId: survey.id,
        question: survey.question,
        answer: survey.answers[0].answer,
        date: new Date()
      }
      const surveyResult = await sut.add(surveyResultParams)

      expect(surveyResult).toEqual(MongoDbHelper.map(surveyResultParams))
    })
  })
})
