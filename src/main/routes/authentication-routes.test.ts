import request from 'supertest'
import {
  Collection,
  MongoDbHelper
} from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'
import env from '../config/env'

const makeFakeAccount = (): any => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  passwordConfirm: 'valid_password'
})

let accountCollection: Collection

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoDbHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      await accountCollection.insertOne({
        ...makeFakeAccount(),
        password: await hash('valid_password', env.bcryptSalt)
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid_email@mail.com',
          password: 'valid_password'
        })
        .expect(200)
    })
  })
})