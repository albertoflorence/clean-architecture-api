import {
  AddAccount,
  AddAccountModel,
  Authentication,
  AuthenticationModel
} from '@/domain/usecases'
import {
  defaultValues,
  mockAccountModel,
  mockAuthenticationParams
} from '../../domain/mocks'

export class AuthenticationStub implements Authentication {
  result: string | null = 'any_token'
  credentials: AuthenticationModel = defaultValues(mockAuthenticationParams())

  auth = async (credentials: AuthenticationModel): Promise<string | null> => {
    this.credentials = credentials
    return this.result
  }
}

export class AddAccountStub implements AddAccount {
  result: boolean = true
  account: AddAccountModel = defaultValues(mockAccountModel())
  async add(account: AddAccountModel): Promise<boolean> {
    this.account = account
    return this.result
  }
}
