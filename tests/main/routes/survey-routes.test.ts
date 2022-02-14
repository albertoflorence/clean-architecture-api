import jwt from 'jsonwebtoken'
import { env, app } from '@/main/config'
import request from 'supertest'
import { MongoDbHelper } from '@/infra/db'
import { Collection, Document, ObjectId } from 'mongodb'
import { AccountModel } from '@/domain/models'
import { mockAccountModel, mockAddSurveyParams } from '@/tests/domain/mocks'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessTokenWithRole = async (role?: string): Promise<string> => {
  return await makeAccessTokenBase({ ...mockAccountModel(), role })
}

const makeAccessToken = async (): Promise<string> => {
  return await makeAccessTokenBase(mockAccountModel())
}

const makeAccessTokenBase = async (
  userAccount: AccountModel
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
      await request(app)
        .post('/api/surveys')
        .send(mockAddSurveyParams())
        .expect(403)
    })

    it('Should return 403 on survey if role is not admin', async () => {
      const accessToken = await makeAccessTokenWithRole('not_admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParams())
        .expect(403)
    })

    it('Should return 204 on survey if role is admin', async () => {
      const accessToken = await makeAccessTokenWithRole('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(mockAddSurveyParams())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('Should return 403 if no token is provided', async () => {
      await request(app).get('/api/surveys').send().expect(403)
    })

    it('Should return 200 on success', async () => {
      const accessToken = await makeAccessToken()
      await surveyCollection.insertOne(mockAddSurveyParams())
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send()
        .expect(200)
    })
  })
})
