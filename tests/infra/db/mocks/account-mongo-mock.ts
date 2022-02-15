import { mockAddAccountParams } from '@/tests/domain/mocks'
import { AccountModel } from '@/domain/models'
import { MongoDbHelper } from '@/infra/db'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config'

export const mockMongoAccount = async (): Promise<AccountModel> => {
  const collection = MongoDbHelper.getCollection('accounts')

  const document = await collection.insertOne(mockAddAccountParams())
  const account = await collection.findOne({ _id: document.insertedId })
  return MongoDbHelper.map(account)
}

export const mockMongoAccountWithAccessToken =
  async (): Promise<AccountModel> => {
    const collection = MongoDbHelper.getCollection('accounts')

    const account = await mockMongoAccount()
    const accessToken = generateUserToken(account.id)
    await collection.updateOne(
      { _id: new ObjectId(account.id) },
      { $set: { accessToken } }
    )

    return {
      ...account,
      accessToken
    }
  }

const generateUserToken = (id: string): string => {
  const accessToken = jwt.sign(id, env.jwtSecret)
  return accessToken
}
