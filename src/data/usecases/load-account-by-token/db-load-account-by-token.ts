import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { AccountModel } from '../add-account/protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async loadByToken(
    accessToken: string,
    role?: string | undefined
  ): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
