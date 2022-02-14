import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { MongoDbHelper, SurveyMongoRepository } from '@/infra/db'
import { Collection } from 'mongodb'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

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
      await sut.add(mockAddSurveyParams())
      const survey = await surveyCollection.findOne(mockAddSurveyParams())
      expect(survey).toBeTruthy()
    })
  })

  describe('load', () => {
    it('Should load surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([
        mockAddSurveyParams(),
        mockAddSurveyParams()
      ])
      const surveys = await sut.load()

      expect(surveys.length).toBe(2)
      expect(surveys[0].answers).toEqual(mockAddSurveyParams().answers)
    })
  })

  describe('loadById', () => {
    it('Should load a survey on success', async () => {
      const sut = makeSut()
      const { insertedId } = await surveyCollection.insertOne(
        mockAddSurveyParams()
      )
      const result = await surveyCollection.findOne({
        _id: insertedId
      })
      const survey = await sut.loadById(insertedId.toHexString())
      expect(survey).toEqual(MongoDbHelper.map(result))
    })

    it('Should return null if no survey is found', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('6209e3c3c52901c833e1b2f6')
      expect(survey).toBeNull()
    })
  })
})
