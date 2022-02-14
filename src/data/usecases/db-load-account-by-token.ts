import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken(accessToken: string): LoadAccountByToken.Result {
    const isValidToken = await this.decrypter.decrypt(accessToken)
    if (isValidToken) {
      return await this.loadAccountByTokenRepository.loadByToken(accessToken)
    }
    return null
  }
}
