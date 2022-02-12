import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken(accessToken: string): Promise<AccountModel | null> {
    const isValidToken = await this.decrypter.decrypt(accessToken)
    if (isValidToken) {
      return await this.loadAccountByTokenRepository.loadByToken(accessToken)
    }
    return null
  }
}
