import { DbLoadAccountByToken } from '../../../data/usecases'
import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt.adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken =>
  new DbLoadAccountByToken(
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
