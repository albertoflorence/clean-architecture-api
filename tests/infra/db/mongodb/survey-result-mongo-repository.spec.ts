import { Collection } from 'mongodb'
import { MongoDbHelper, SurveyResultMongoRepository } from '@/infra/db'
import {
  mockMongoSurvey,
  mockMongoAccount,
  findSurveyResult,
  mockMongoSurveyResult,
  mockSurveyResultParams
} from '@/tests/infra/db'

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
      const surveyResultParams = await mockSurveyResultParams()
      await sut.add(surveyResultParams)
      const survey = await findSurveyResult(surveyResultParams)
      expect(survey).toBeTruthy()
    })

    it('Should update the survey result if one already exist', async () => {
      const sut = makeSut()
      const surveyResultParams = await mockSurveyResultParams()
      const updateSurveyResultParams = {
        ...surveyResultParams,
        date: new Date(),
        answer: 'any_answer'
      }
      await sut.add(updateSurveyResultParams)
      const survey = await findSurveyResult(updateSurveyResultParams)
      expect(survey).toBeTruthy()
      expect(await surveyResultCollection.countDocuments()).toBe(1)
    })
  })

  describe('loadBySurveyId', () => {
    it('Should load survey result', async () => {
      const sut = makeSut()
      const account = await mockMongoAccount()
      const survey = await mockMongoSurvey()
      await mockMongoSurveyResult([
        await mockSurveyResultParams(survey, account, 0),
        await mockSurveyResultParams(survey, undefined, 0),
        await mockSurveyResultParams(survey, undefined, 0),
        await mockSurveyResultParams(survey, undefined, 1)
      ])

      const result = await sut.loadBySurveyId(survey.id, account.id)
      expect(result?.answers[0].count).toBe(3)
      expect(result?.answers[0].percent).toBe(75)
      expect(result?.answers[1].count).toBe(1)
      expect(result?.answers[1].percent).toBe(25)
    })
  })
})
