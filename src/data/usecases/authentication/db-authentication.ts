import {
  Authentication,
  AuthenticationModel
} from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth(credentials: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(
      credentials.email
    )

    if (account) {
      const isValid = await this.hashComparer.compare(
        credentials.password,
        account.password
      )
      if (isValid) {
        return await this.tokenGenerator.generate(account.id)
      }
    }

    return null
  }
}
