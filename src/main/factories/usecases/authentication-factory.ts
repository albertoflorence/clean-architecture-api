import { DbAuthentication } from '@/data/usecases'
import { Authentication } from '@/domain/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { env } from '@/main/config'

export const makeDbAuthentication = (): Authentication => {
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(env.bcryptSalt),
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
}
