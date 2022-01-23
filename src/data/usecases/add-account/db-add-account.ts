import { AccountModel } from '../../../domain/models/account'
import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccountRepository } from './protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly AddAccountRepository: AddAccountRepository
  ) {}

  add = async (account: AddAccountModel): Promise<AccountModel> => {
    await this.encrypter.encrypt(account.password)
    return await this.AddAccountRepository.add(account)
  }
}
