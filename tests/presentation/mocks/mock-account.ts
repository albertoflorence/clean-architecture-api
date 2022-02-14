import { AddAccount, Authentication } from '@/domain/usecases'
import {
  defaultValues,
  mockAccountModel,
  mockAuthenticationParams
} from '../../domain/mocks'

export class AuthenticationStub implements Authentication {
  result: string | null = 'any_token'
  credentials: Authentication.Params = defaultValues(mockAuthenticationParams())

  auth = async (credentials: Authentication.Params): Authentication.Result => {
    this.credentials = credentials
    return this.result
  }
}

export class AddAccountStub implements AddAccount {
  result: boolean = true
  account: AddAccount.Params = defaultValues(mockAccountModel())
  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.account = account
    return this.result
  }
}
