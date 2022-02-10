import jwt from 'jsonwebtoken'
import env from '../config/env'
import request from 'supertest'
import {
  MongoDbHelper,
  Collection
} from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { AddSurveyModel } from '../../domain/usecases/add-survey'
import { Document, ObjectId } from 'mongodb'
import { AddAccountModel } from '../../domain/usecases'

let surveyCollection: Collection
let accountCollection: Collection

const fakeDate = new Date()
const makeFakeSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'http://image-name.com'
    },
    { answer: 'another_answer' }
  ],
  date: fakeDate
})

const makeAccessTokenWithRole = async (role?: string): Promise<string> => {
  return await makeAccessTokenBase({ ...userAccountData(), role })
}

const makeAccessToken = async (): Promise<string> => {
  return await makeAccessTokenBase(userAccountData())
}

interface AddAccountWithRoleModel extends AddAccountModel {
  role?: string
}

const makeAccessTokenBase = async (
  userAccount: AddAccountWithRoleModel
): Promise<string> => {
  const user = await accountCollection.insertOne(userAccount)
  const accessToken = generateUserToken(user.insertedId)
  await updateUserAccountToken(user, accessToken)

  return accessToken
}

const updateUserAccountToken = async (
  user: Document,
  accessToken: string
): Promise<void> => {
  await accountCollection.updateOne(
    { _id: user.insertedId },
    { $set: { accessToken } }
  )
}

const generateUserToken = (userId: ObjectId): string => {
  const id = userId.toHexString()
  const accessToken = jwt.sign(id, env.jwtSecret)
  return accessToken
}

const userAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

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
      const accessToken = await makeAccessTokenWithRole('not_admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurvey())
        .expect(403)
    })

    it('Should return 204 on survey if role is admin', async () => {
      const accessToken = await makeAccessTokenWithRole('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurvey())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('Should return 403 if no token is provided', async () => {
      await request(app).get('/api/surveys').send().expect(403)
    })

    it('Should return 200 on success', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne(makeFakeSurvey())
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send()
        .expect(200)
    })
  })
})
