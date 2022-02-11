import { AddAccountRepository } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { env } from '@/main/config'

export const makeDbAddAccount = (): AddAccountRepository => {
  return new DbAddAccount(
    new BcryptAdapter(env.bcryptSalt),
    new AccountMongoRepository()
  )
}
