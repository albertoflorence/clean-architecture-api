import { Collection } from 'mongodb'
import { LogErrorMongoRepository } from '.'

import { MongoDbHelper } from '../helpers/mongo-helper'

describe('Account MongoDb Repository', () => {
  let collection: Collection
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    collection = MongoDbHelper.getCollection('errors')
    await collection.deleteMany({})
  })

  const makeSut = (): LogErrorMongoRepository => {
    return new LogErrorMongoRepository()
  }

  it('Should return an log on success', async () => {
    const sut = makeSut()
    const stack = 'Error Message Stack'
    await sut.saveLog(stack)
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})
