import { MongoDbHelper, SurveyResultMongoRepository } from '@/infra/db'
import { Collection } from 'mongodb'
import { mockMongoAccount, mockMongoSurvey } from '@/tests/infra/db'
import { AddSurveyResult } from '@/domain/usecases'

let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const mockSurveyResultParams = async (): Promise<AddSurveyResult.Params> => {
  const account = await mockMongoAccount()
  const survey = await mockMongoSurvey()
  return {
    accountId: account.id,
    surveyId: survey.id,
    question: survey.question,
    answer: survey.answers[0].answer,
    date: new Date()
  }
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
      const surveyResultParams = await mockSurveyResultParams()
      const { id, ...result } = await sut.add(surveyResultParams)

      expect(result).toEqual(surveyResultParams)
    })

    it('Should update the survey result if one already exist', async () => {
      const sut = makeSut()
      const surveyResultParams = await mockSurveyResultParams()
      await surveyResultCollection.insertOne(surveyResultParams)
      const updateSurveyResult = {
        ...surveyResultParams,
        date: new Date(),
        answer: 'new_answer'
      }
      const result = await sut.add(updateSurveyResult)

      expect(await surveyResultCollection.countDocuments()).toBe(1)
      expect(result).toEqual(MongoDbHelper.map(updateSurveyResult))
    })
  })
})
