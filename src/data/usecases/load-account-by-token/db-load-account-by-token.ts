import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { AccountModel } from '../add-account/protocols'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken(
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    const isValidToken = await this.decrypter.decrypt(accessToken)
    if (isValidToken) {
      return await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      )
    }
    return null
  }
}
