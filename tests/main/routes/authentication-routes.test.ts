import request from 'supertest'
import { MongoDbHelper } from '@/infra/db'
import { app, env } from '@/main/config'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'

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
    it('Should return 307 on signup', async () => {
      await request(app).post('/api/signup').send(makeFakeAccount()).expect(307)
    })

    it('Should return 400 on signup if e-mail already exist', async () => {
      await accountCollection.insertOne(makeFakeAccount())
      await request(app).post('/api/signup').send(makeFakeAccount()).expect(400)
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

    it('Should return 401 on login if invalid credentials are provided', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'wrong_email@mail.com',
          password: 'wrong_password'
        })
        .expect(401)
    })
  })
})
