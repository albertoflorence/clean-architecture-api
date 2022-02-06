import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log'
import { makeSignUpValidation } from './signup-validation-factory'

const bcryptSalt = 12

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    new DbAddAccount(
      new BcryptAdapter(bcryptSalt),
      new AccountMongoRepository()
    ),
    makeSignUpValidation()
  )
  return new LogControllerDecorator(
    signUpController,
    new LogErrorMongoRepository()
  )
}

export const routeSignUpController = adaptRoute(makeSignUpController())
