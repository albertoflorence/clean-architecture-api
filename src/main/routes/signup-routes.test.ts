import request from 'supertest'
import { MongoDbHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoDbHelper.getCollection('accounts').deleteMany({})
  })

  it('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      })
      .expect(200)
  })
})
