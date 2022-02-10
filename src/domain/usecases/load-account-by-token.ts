import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  loadByToken: (accessToken: string) => Promise<AccountModel | null>
}
