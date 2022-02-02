import { AddAccountRepository } from '../../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../../domain/models/account'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoDbHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  add = async (account: AddAccountModel): Promise<AccountModel> => {
    const result = await MongoDbHelper.getCollection('accounts').insertOne(
      account
    )

    return {
      id: result.insertedId.toString(),
      name: account.name,
      email: account.email,
      password: account.password
    }
  }
}
