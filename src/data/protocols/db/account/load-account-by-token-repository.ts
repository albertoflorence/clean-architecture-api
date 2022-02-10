import { AccountModel } from '../../../usecases/add-account/protocols'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string) => Promise<AccountModel | null>
}
