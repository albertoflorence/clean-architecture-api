import { LoadAccountByToken } from '@/domain/usecases'

export interface LoadAccountByTokenRepository {
  loadByToken: (accessToken: string) => LoadAccountByTokenRepository.Result
}

export namespace LoadAccountByTokenRepository {
  export type Result = LoadAccountByToken.Result
}
