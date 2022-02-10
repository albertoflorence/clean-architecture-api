import jwt from 'jsonwebtoken'
import env from '../config/env'
import request from 'supertest'
import {
  MongoDbHelper,
  Collection
} from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { AddSurveyModel } from '../../domain/usecases/add-survey'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'http://image-name.com'
    },
    { answer: 'another_answer' }
  ]
})

const makeUserAccountWithRole = async (
  role: string
): Promise<{ accessToken: string }> => {
  const res = await accountCollection.insertOne({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
    accessToken: 'any_token',
    role
  })
  const id = res.insertedId.toHexString()
  const accessToken = jwt.sign(id, env.jwtSecret)
  await accountCollection.updateOne(
    { _id: res.insertedId },
    { $set: { accessToken } }
  )

  return { accessToken }
}

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    it('Should return 403 on survey without accessToken', async () => {
      await request(app).post('/api/surveys').send(makeFakeSurvey()).expect(403)
    })

    it('Should return 403 on survey if role is not admin', async () => {
      const { accessToken } = await makeUserAccountWithRole('not_admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurvey())
        .expect(403)
    })

    it('Should return 204 on survey if role is admin', async () => {
      const { accessToken } = await makeUserAccountWithRole('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurvey())
        .expect(204)
    })
  })
})
