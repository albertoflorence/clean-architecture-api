import { AddAccountRepository, Hasher } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  add = async (account: AddAccount.Params): Promise<AddAccount.Result> => {
    return await this.addAccountRepository.add({
      ...account,
      password: await this.hasher.hash(account.password)
    })
  }
}
