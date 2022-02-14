import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import {
  defaultValues,
  mockAccountModel,
  mockAddAccountParams
} from '@/tests/domain/mocks'

export class AddAccountRepositoryStub implements AddAccountRepository {
  readonly result: boolean = true
  account: AddAccountRepository.Params = defaultValues(mockAddAccountParams())

  async add(
    account: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.account = account
    return this.result
  }
}

export class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository
{
  email: string = ''
  result: AccountModel | null = mockAccountModel()

  async loadByEmail(email: string): LoadAccountByEmailRepository.Result {
    this.email = email
    return this.result
  }
}

export class UpdateAccessTokenRepositoryStub
  implements UpdateAccessTokenRepository
{
  id: string = ''
  token: string = ''
  updateAccessToken = async (
    id: string,
    token: string
  ): UpdateAccessTokenRepository.Result => {
    this.id = id
    this.token = token
  }
}

export class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository
{
  result = mockAccountModel()
  token = ''
  loadByToken = async (token: string): LoadAccountByTokenRepository.Result => {
    this.token = token
    this.result.accessToken = token
    return this.result
  }
}
