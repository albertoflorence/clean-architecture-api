import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases'
import {
  defaultValues,
  mockAccountModel,
  mockAddAccountParams
} from '@/tests/domain/mocks'

export class AddAccountRepositoryStub implements AddAccountRepository {
  readonly result: boolean = true
  account: AddAccountModel = defaultValues(mockAddAccountParams())

  async add(account: AddAccountModel): Promise<boolean> {
    this.account = account
    return this.result
  }
}

export class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository
{
  email: string = ''
  result: AccountModel | null = mockAccountModel()

  async loadByEmail(email: string): Promise<AccountModel | null> {
    this.email = email
    return this.result
  }
}

export class UpdateAccessTokenRepositoryStub
  implements UpdateAccessTokenRepository
{
  id: string = ''
  token: string = ''
  updateAccessToken = async (id: string, token: string): Promise<void> => {
    this.id = id
    this.token = token
  }
}

export class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository
{
  result = mockAccountModel()
  token = ''
  loadByToken = async (token: string): Promise<AccountModel | null> => {
    this.token = token
    this.result.accessToken = token
    return this.result
  }
}
