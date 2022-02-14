import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { Collection, ObjectId } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  private get collection(): Collection {
    return MongoDbHelper.getCollection('accounts')
  }

  async add(
    account: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    await this.collection.insertOne(account)
    return true
  }

  async loadByEmail(email: string): LoadAccountByEmailRepository.Result {
    const result = await this.collection.findOne(
      { email },
      { projection: { _id: 1, name: 1, password: 1, email: 1 } }
    )

    return result && MongoDbHelper.map(result)
  }

  async updateAccessToken(
    id: string,
    accessToken: string
  ): UpdateAccessTokenRepository.Result {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }

  async loadByToken(accessToken: string): LoadAccountByTokenRepository.Result {
    const account = await this.collection.findOne({ accessToken })
    return account && MongoDbHelper.map(account)
  }
}
