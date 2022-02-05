import { AccountModel } from '../../usecases/add-account/protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel | null>
}
