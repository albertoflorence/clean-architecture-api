import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoDbHelper, Collection } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  private get collection(): Collection {
    return MongoDbHelper.getCollection('accounts')
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const result = await this.collection.insertOne(account)

    return {
      id: result.insertedId.toString(),
      name: account.name,
      email: account.email,
      password: account.password
    }
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const result = await this.collection.findOne(
      { email },
      { projection: { _id: 1, name: 1, password: 1, email: 1 } }
    )

    return result && MongoDbHelper.map(result)
  }
}
