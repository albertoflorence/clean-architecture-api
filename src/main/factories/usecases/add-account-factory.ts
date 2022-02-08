import {
  AddAccountRepository,
  DbAddAccount
} from '../../../data/usecases/add-account/protocols'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../config/env'

export const makeDbAddAccount = (): AddAccountRepository => {
  return new DbAddAccount(
    new BcryptAdapter(env.bcryptSalt),
    new AccountMongoRepository()
  )
}
