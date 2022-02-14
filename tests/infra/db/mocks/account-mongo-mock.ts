import { mockAddAccountParams } from '@/tests/domain/mocks'
import { AccountModel } from '@/domain/models'
import { MongoDbHelper } from '@/infra/db'

export const mockMongoAccount = async (): Promise<AccountModel> => {
  const collection = MongoDbHelper.getCollection('accounts')

  const document = await collection.insertOne(mockAddAccountParams())
  const account = await collection.findOne({ _id: document.insertedId })
  return MongoDbHelper.map(account)
}
