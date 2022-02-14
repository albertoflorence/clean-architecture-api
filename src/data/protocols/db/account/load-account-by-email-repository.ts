import { AccountModel } from '@/domain/models'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => LoadAccountByEmailRepository.Result
}

export namespace LoadAccountByEmailRepository {
  export type Result = Promise<AccountModel | null>
}
