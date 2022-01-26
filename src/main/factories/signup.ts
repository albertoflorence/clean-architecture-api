import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/emailValidator/email-validator-adapter'
import validator from 'validator'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/criptography/db/mongodb/account-repository/account'
import { adaptRoute } from '../adapters/express-route-adapter'

const bcryptSalt = 12

export const makeSignUpController = (): SignUpController =>
  new SignUpController(
    new EmailValidatorAdapter(validator),
    new DbAddAccount(
      new BcryptAdapter(bcryptSalt),
      new AccountMongoRepository()
    )
  )

export const routeSignUpController = adaptRoute(makeSignUpController())
