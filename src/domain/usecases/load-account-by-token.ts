import { AccountModel } from '@/domain/models'

export interface LoadAccountByToken {
  loadByToken: (accessToken: string) => Promise<AccountModel | null>
}
