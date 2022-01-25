import { mongoDbHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account MongoDb Repository', () => {
  beforeAll(async () => {
    await mongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    await mongoDbHelper.getCollection('accouns').deleteMany({})
  })

  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})
