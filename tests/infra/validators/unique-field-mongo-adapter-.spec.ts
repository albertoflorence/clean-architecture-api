import { Collection } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'
import { UniqueFieldMongoAdapter } from '@/infra/validators'

describe('Unique Field Mongo Adapter', () => {
  let collection: Collection
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    collection = MongoDbHelper.getCollection('any_collection')
    await collection.deleteMany({})
  })

  const makeSut = (): UniqueFieldMongoAdapter => {
    return new UniqueFieldMongoAdapter('any_collection')
  }

  it('Should return false if the value already exist', async () => {
    const sut = makeSut()
    const input = { field: 'unique_value' }
    await collection.insertOne(input)
    const isUnique = await sut.isUnique(input)
    expect(isUnique).toBe(false)
  })

  it('Should return true if value not exist', async () => {
    const sut = makeSut()
    await collection.insertOne({ field: 'unique_value' })
    const input = { field: 'any_value' }
    const isUnique = await sut.isUnique(input)
    expect(isUnique).toBe(true)
  })
})
