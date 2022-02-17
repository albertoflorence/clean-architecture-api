import { app } from '@/main/config'
import request from 'supertest'
import { MongoDbHelper } from '@/infra/db'
import { Collection } from 'mongodb'
import { mockMongoAccountWithAccessToken } from '@/tests/infra/db'
import { mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoDbHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = MongoDbHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on add survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results').send().expect(403)
    })

    it('Should return 200 on add survey result success', async () => {
      const { accessToken } = await mockMongoAccountWithAccessToken()
      const survey = mockAddSurveyParams()
      const id = (
        await surveyCollection.insertOne(survey)
      ).insertedId.toHexString()

      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken as string)
        .send({
          answer: survey.answers[0].answer
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    it('Should return 403 on load survey result without accessToken', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403)
    })

    it('Should return 200 on add survey result success', async () => {
      const { accessToken } = await mockMongoAccountWithAccessToken()
      const survey = mockAddSurveyParams()
      const id = (
        await surveyCollection.insertOne(survey)
      ).insertedId.toHexString()

      await request(app)
        .get(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken as string)
        .expect(200)
    })
  })
})
