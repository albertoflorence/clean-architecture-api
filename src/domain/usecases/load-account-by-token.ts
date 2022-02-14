import { AccountModel } from '@/domain/models'

export interface LoadAccountByToken {
  loadByToken: (accessToken: string) => LoadAccountByToken.Result
}

export namespace LoadAccountByToken {
  export type Result = Promise<AccountModel | null>
}
