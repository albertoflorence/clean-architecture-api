import { AccountModel } from '@/domain/models'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string) => Promise<AccountModel | null>
}
