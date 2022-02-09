import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { LoadAccountByToken } from '../../../../domain/usecases/load-account-by-token'
import { MongoDbHelper, Collection, ObjectId } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByToken
{
  private get collection(): Collection {
    return MongoDbHelper.getCollection('accounts')
  }

  async add(account: AddAccountModel): Promise<boolean> {
    await this.collection.insertOne(account)
    return true
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const result = await this.collection.findOne(
      { email },
      { projection: { _id: 1, name: 1, password: 1, email: 1 } }
    )

    return result && MongoDbHelper.map(result)
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }

  async loadByToken(
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const account = await this.collection.findOne({ accessToken, role })
    return account && MongoDbHelper.map(account)
  }
}
