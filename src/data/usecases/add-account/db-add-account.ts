import {
  Encrypter,
  AddAccountRepository,
  AccountModel,
  AddAccountModel,
  AddAccount
} from './protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly AddAccountRepository: AddAccountRepository
  ) {}

  add = async (account: AddAccountModel): Promise<AccountModel> => {
    return await this.AddAccountRepository.add({
      ...account,
      password: await this.encrypter.encrypt(account.password)
    })
  }
}
