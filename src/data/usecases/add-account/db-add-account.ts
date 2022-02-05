import {
  Hasher,
  AddAccountRepository,
  AccountModel,
  AddAccountModel,
  AddAccount
} from './protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  add = async (account: AddAccountModel): Promise<AccountModel> => {
    return await this.addAccountRepository.add({
      ...account,
      password: await this.hasher.hash(account.password)
    })
  }
}
