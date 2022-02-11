import { DbLoadAccountByToken } from '@/data/usecases'
import { LoadAccountByToken } from '@/domain/usecases'
import { JwtAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db'
import { env } from '@/main/config'

export const makeDbLoadAccountByToken = (): LoadAccountByToken =>
  new DbLoadAccountByToken(
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )
