import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt.adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../config/env'

export const makeAuthentication = (): Authentication => {
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(env.bcryptSalt),
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
}
