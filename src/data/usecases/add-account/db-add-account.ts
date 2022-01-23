import { AccountModel } from '../../../domain/models/account'
import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}
  add = async (account: AddAccountModel): Promise<AccountModel> => {
    return {
      id: 'valid_id',
      name: account.name,
      email: account.email,
      password: await this.encrypter.encrypt(account.password)
    }
  }
}
