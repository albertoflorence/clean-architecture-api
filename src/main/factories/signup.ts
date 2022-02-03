import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/emailValidator/email-validator-adapter'
import validator from 'validator'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { adaptRoute } from '../adapters/express-route-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-repository'

const bcryptSalt = 12

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    new EmailValidatorAdapter(validator),
    new DbAddAccount(
      new BcryptAdapter(bcryptSalt),
      new AccountMongoRepository()
    )
  )
  return new LogControllerDecorator(
    signUpController,
    new LogErrorMongoRepository()
  )
}

export const routeSignUpController = adaptRoute(makeSignUpController())
